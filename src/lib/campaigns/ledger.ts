// The approval ledger (U1). Every path that moves an email towards sending
// goes through here, and the database refuses anything that skips it (see
// src/db/schema/campaigns.ts). Nothing in this file acts on a timer: a
// campaign waits for approval for as long as it takes.
import { and, asc, count, eq, inArray, isNull, sql } from "drizzle-orm";
import {
  approval,
  campaign,
  emailMessage,
  lead,
  type ApprovalChannel,
  type CampaignStatus,
} from "@/db/schema";
import { trackAgentStep, type EventDb } from "@/lib/events/track";

export type LedgerErrorCode = "not_found" | "wrong_status" | "nothing_to_approve";

export class LedgerError extends Error {
  constructor(
    public code: LedgerErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "LedgerError";
  }
}

type Scope = { workspaceId: string; campaignId: string };
type Tx = Parameters<Parameters<EventDb["transaction"]>[0]>[0];

const REVIEWABLE: CampaignStatus[] = ["draft", "awaiting_approval"];

async function lockCampaign(tx: Tx, { workspaceId, campaignId }: Scope) {
  const [row] = await tx
    .select()
    .from(campaign)
    .where(and(eq(campaign.id, campaignId), eq(campaign.workspaceId, workspaceId)))
    .for("update");
  if (!row) throw new LedgerError("not_found", "We couldn't find that campaign in this workspace.");
  return row;
}

function requireStatus(current: CampaignStatus, allowed: CampaignStatus[], action: string) {
  if (!allowed.includes(current)) {
    throw new LedgerError("wrong_status", `This campaign is ${current.replace("_", " ")}, so it can't be ${action}.`);
  }
}

export type NewCampaign = {
  workspaceId: string;
  name: string;
  leads: {
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    title?: string;
    emails: { sequenceStep?: number; subject: string; body: string }[];
  }[];
};

/** Create a draft campaign with its leads and draft emails. The Writer calls this. */
export async function createCampaign(db: EventDb, input: NewCampaign) {
  return db.transaction(async (tx) => {
    const [c] = await tx
      .insert(campaign)
      .values({ workspaceId: input.workspaceId, name: input.name })
      .returning();
    for (const l of input.leads) {
      const { emails, ...fields } = l;
      const [row] = await tx
        .insert(lead)
        .values({ ...fields, workspaceId: input.workspaceId, campaignId: c.id })
        .returning();
      if (emails.length) {
        await tx.insert(emailMessage).values(
          emails.map((e) => ({
            workspaceId: input.workspaceId,
            campaignId: c.id,
            leadId: row.id,
            sequenceStep: e.sequenceStep ?? 1,
            subject: e.subject,
            body: e.body,
          })),
        );
      }
    }
    return c;
  });
}

/** Put a draft campaign in the approval queue. It stays there until a person acts. */
export async function submitForApproval(db: EventDb, scope: Scope) {
  return db.transaction(async (tx) => {
    const c = await lockCampaign(tx, scope);
    requireStatus(c.status, ["draft"], "sent for approval");
    const [{ drafts }] = await tx
      .select({ drafts: count() })
      .from(emailMessage)
      .where(and(eq(emailMessage.campaignId, c.id), eq(emailMessage.status, "draft")));
    if (drafts === 0) throw new LedgerError("nothing_to_approve", "This campaign has no emails to approve.");
    await tx.update(campaign).set({ status: "awaiting_approval" }).where(eq(campaign.id, c.id));
  });
}

/**
 * Approve every remaining draft email in the campaign in one step. Writes
 * one approval record and links each email to it.
 */
export async function approveCampaign(
  db: EventDb,
  input: Scope & { userId: string; channel: ApprovalChannel },
) {
  const result = await db.transaction(async (tx) => {
    const c = await lockCampaign(tx, input);
    requireStatus(c.status, ["awaiting_approval"], "approved");

    const drafts = await tx
      .select({ id: emailMessage.id })
      .from(emailMessage)
      .where(and(eq(emailMessage.campaignId, c.id), eq(emailMessage.status, "draft")));
    if (drafts.length === 0) {
      throw new LedgerError("nothing_to_approve", "Every email in this campaign was removed, so there's nothing to approve.");
    }

    const [a] = await tx
      .insert(approval)
      .values({
        workspaceId: input.workspaceId,
        campaignId: c.id,
        approvedById: input.userId,
        channel: input.channel,
        emailCount: drafts.length,
      })
      .returning();
    await tx
      .update(emailMessage)
      .set({ status: "approved", approvalId: a.id })
      .where(inArray(emailMessage.id, drafts.map((d) => d.id)));
    await tx.update(campaign).set({ status: "approved", pausedReason: null }).where(eq(campaign.id, c.id));
    return { approvalId: a.id, emailCount: drafts.length };
  });

  await trackAgentStep(db, {
    workspaceId: input.workspaceId,
    runId: input.campaignId,
    campaignId: input.campaignId,
    agent: "platform",
    step: "campaign.approve",
    status: "succeeded",
    count: result.emailCount,
    metadata: { channel: input.channel },
  });
  return result;
}

/** Remove a lead (and its unapproved emails) before the campaign is approved. */
export async function removeLead(db: EventDb, input: Scope & { leadId: string; userId: string }) {
  await db.transaction(async (tx) => {
    const c = await lockCampaign(tx, input);
    requireStatus(c.status, REVIEWABLE, "edited");
    const updated = await tx
      .update(lead)
      .set({ removedAt: new Date(), removedById: input.userId })
      .where(and(eq(lead.id, input.leadId), eq(lead.campaignId, c.id), isNull(lead.removedAt)))
      .returning({ id: lead.id });
    if (updated.length === 0) throw new LedgerError("not_found", "That lead isn't in this campaign.");
    await tx
      .update(emailMessage)
      .set({ status: "removed" })
      .where(and(eq(emailMessage.leadId, input.leadId), eq(emailMessage.status, "draft")));
  });
}

/** Remove one email before the campaign is approved. */
export async function removeEmail(db: EventDb, input: Scope & { emailId: string }) {
  await db.transaction(async (tx) => {
    const c = await lockCampaign(tx, input);
    requireStatus(c.status, REVIEWABLE, "edited");
    const updated = await tx
      .update(emailMessage)
      .set({ status: "removed" })
      .where(
        and(eq(emailMessage.id, input.emailId), eq(emailMessage.campaignId, c.id), eq(emailMessage.status, "draft")),
      )
      .returning({ id: emailMessage.id });
    if (updated.length === 0) throw new LedgerError("not_found", "That email isn't waiting for approval.");
  });
}

/** Stop sending. Approved emails stay approved and wait. */
export async function pauseCampaign(db: EventDb, input: Scope & { reason: string }) {
  await db.transaction(async (tx) => {
    const c = await lockCampaign(tx, input);
    requireStatus(c.status, ["approved"], "paused");
    await tx.update(campaign).set({ status: "paused", pausedReason: input.reason }).where(eq(campaign.id, c.id));
  });
}

/** Resume a paused campaign. Only emails already approved can send. */
export async function resumeCampaign(db: EventDb, scope: Scope) {
  await db.transaction(async (tx) => {
    const c = await lockCampaign(tx, scope);
    requireStatus(c.status, ["paused"], "resumed");
    await tx.update(campaign).set({ status: "approved", pausedReason: null }).where(eq(campaign.id, c.id));
  });
}

/**
 * The Sender's only way to pick up work: moves up to `limit` approved emails
 * of a running campaign to queued and returns them. A paused or unapproved
 * campaign returns nothing.
 */
export async function queueApprovedEmails(db: EventDb, input: Scope & { limit: number }) {
  return db.transaction(async (tx) => {
    const c = await lockCampaign(tx, input);
    if (c.status !== "approved") return [];
    const ready = await tx
      .select({ id: emailMessage.id })
      .from(emailMessage)
      .where(and(eq(emailMessage.campaignId, c.id), eq(emailMessage.status, "approved")))
      .orderBy(asc(emailMessage.sequenceStep), asc(emailMessage.createdAt))
      .limit(input.limit)
      .for("update", { skipLocked: true });
    if (ready.length === 0) return [];
    return tx
      .update(emailMessage)
      .set({ status: "queued", queuedAt: sql`now()` })
      .where(inArray(emailMessage.id, ready.map((r) => r.id)))
      .returning();
  });
}
