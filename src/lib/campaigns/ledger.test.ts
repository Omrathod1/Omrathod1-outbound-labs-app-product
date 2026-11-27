import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { and, eq, sql } from "drizzle-orm";
import { agentEvent, approval, campaign, emailMessage, user } from "@/db/schema";
import { createTestDb, seedWorkspace } from "../../../test/db";
import {
  approveCampaign,
  createCampaign,
  pauseCampaign,
  queueApprovedEmails,
  removeEmail,
  removeLead,
  resumeCampaign,
  submitForApproval,
} from "./ledger";
import { getCampaignReview, listCampaigns } from "./queries";

let t: Awaited<ReturnType<typeof createTestDb>>;
let workspaceId: string;
const userId = "user_dana";

async function sampleCampaign(ws = workspaceId) {
  const c = await createCampaign(t.db, {
    workspaceId: ws,
    name: "Teams outgrowing spreadsheets",
    leads: [
      { email: "a@kestrel.example", firstName: "Ana", emails: [{ subject: "S1", body: "B1" }, { sequenceStep: 2, subject: "F1", body: "FB1" }] },
      { email: "b@kestrel.example", firstName: "Ben", emails: [{ subject: "S2", body: "B2" }] },
      { email: "c@kestrel.example", firstName: "Cy", emails: [{ subject: "S3", body: "B3" }] },
    ],
  });
  return c.id;
}

const emailsOf = (campaignId: string) =>
  t.db.select().from(emailMessage).where(eq(emailMessage.campaignId, campaignId));

beforeEach(async () => {
  t = await createTestDb();
  workspaceId = await seedWorkspace(t.db);
  await t.db.insert(user).values({ id: userId, name: "Dana Ruiz", email: "dana@example.com" });
});
afterEach(async () => {
  await t.close();
});

describe("approval flow", () => {
  it("approves remaining drafts under one approval record", async () => {
    const campaignId = await sampleCampaign();
    await submitForApproval(t.db, { workspaceId, campaignId });

    const [ben] = (await getCampaignReview(t.db, workspaceId, campaignId))!.leads.filter((l) => l.firstName === "Ben");
    await removeLead(t.db, { workspaceId, campaignId, leadId: ben.id, userId });

    const result = await approveCampaign(t.db, { workspaceId, campaignId, userId, channel: "app" });
    expect(result.emailCount).toBe(3);

    const emails = await emailsOf(campaignId);
    expect(emails.filter((e) => e.status === "approved")).toHaveLength(3);
    expect(emails.filter((e) => e.status === "removed")).toHaveLength(1);
    expect(new Set(emails.filter((e) => e.approvalId).map((e) => e.approvalId))).toEqual(new Set([result.approvalId]));

    const [event] = await t.db.select().from(agentEvent).where(eq(agentEvent.step, "campaign.approve"));
    expect(event).toMatchObject({ agent: "platform", count: 3, campaignId });
  });

  it("can't approve a campaign that wasn't sent for approval", async () => {
    const campaignId = await sampleCampaign();
    await expect(approveCampaign(t.db, { workspaceId, campaignId, userId, channel: "app" })).rejects.toMatchObject({
      code: "wrong_status",
    });
  });

  it("refuses approval when every email was removed", async () => {
    const campaignId = await sampleCampaign();
    await submitForApproval(t.db, { workspaceId, campaignId });
    for (const e of await emailsOf(campaignId)) await removeEmail(t.db, { workspaceId, campaignId, emailId: e.id });
    await expect(approveCampaign(t.db, { workspaceId, campaignId, userId, channel: "app" })).rejects.toMatchObject({
      code: "nothing_to_approve",
    });
  });

  it("can't edit leads after approval", async () => {
    const campaignId = await sampleCampaign();
    await submitForApproval(t.db, { workspaceId, campaignId });
    await approveCampaign(t.db, { workspaceId, campaignId, userId, channel: "slack" });
    const [ana] = (await getCampaignReview(t.db, workspaceId, campaignId))!.leads;
    await expect(removeLead(t.db, { workspaceId, campaignId, leadId: ana.id, userId })).rejects.toMatchObject({
      code: "wrong_status",
    });
  });

  it("never touches another workspace's campaign", async () => {
    const other = await seedWorkspace(t.db, "ws_other");
    const campaignId = await sampleCampaign(other);
    await expect(submitForApproval(t.db, { workspaceId, campaignId })).rejects.toMatchObject({ code: "not_found" });
    expect(await getCampaignReview(t.db, workspaceId, campaignId)).toBeNull();
  });
});

describe("sending", () => {
  it("queues nothing until the campaign is approved, however long it waits", async () => {
    const campaignId = await sampleCampaign();
    await submitForApproval(t.db, { workspaceId, campaignId });
    // Simulate the campaign waiting for days. Nothing may time out into sending.
    await t.db.execute(sql`update campaign set created_at = now() - interval '30 days', updated_at = now() - interval '30 days'`);
    await t.db.execute(sql`update email_message set created_at = now() - interval '30 days'`);
    expect(await queueApprovedEmails(t.db, { workspaceId, campaignId, limit: 100 })).toEqual([]);
    expect((await emailsOf(campaignId)).every((e) => e.status === "draft")).toBe(true);
  });

  it("queues approved emails, first steps first, and stops while paused", async () => {
    const campaignId = await sampleCampaign();
    await submitForApproval(t.db, { workspaceId, campaignId });
    await approveCampaign(t.db, { workspaceId, campaignId, userId, channel: "email" });

    await pauseCampaign(t.db, { workspaceId, campaignId, reason: "Bounce rate passed 2%." });
    expect(await queueApprovedEmails(t.db, { workspaceId, campaignId, limit: 100 })).toEqual([]);

    await resumeCampaign(t.db, { workspaceId, campaignId });
    const batch = await queueApprovedEmails(t.db, { workspaceId, campaignId, limit: 3 });
    expect(batch.map((e) => e.sequenceStep)).toEqual([1, 1, 1]);
    expect(batch.every((e) => e.status === "queued" && e.approvalId)).toBe(true);
  });

  it("lists campaigns with counts to review", async () => {
    const campaignId = await sampleCampaign();
    await submitForApproval(t.db, { workspaceId, campaignId });
    const [row] = await listCampaigns(t.db, workspaceId);
    expect(row).toMatchObject({ id: campaignId, status: "awaiting_approval", toReview: 4, approved: 0 });
  });
});

// These go around the app code on purpose: the database itself must refuse.
describe("database rules", () => {
  it("refuses to queue or send an email with no approval", async () => {
    const campaignId = await sampleCampaign();
    const [e] = await emailsOf(campaignId);
    for (const status of ["approved", "queued", "sent"] as const) {
      await expect(t.db.update(emailMessage).set({ status }).where(eq(emailMessage.id, e.id))).rejects.toThrow();
    }
  });

  it("refuses an approval from a different campaign", async () => {
    const a = await sampleCampaign();
    const b = await sampleCampaign();
    await submitForApproval(t.db, { workspaceId, campaignId: a });
    const { approvalId } = await approveCampaign(t.db, { workspaceId, campaignId: a, userId, channel: "app" });
    const [e] = await emailsOf(b);
    await expect(
      t.db.update(emailMessage).set({ status: "approved", approvalId }).where(eq(emailMessage.id, e.id)),
    ).rejects.toThrow();
  });

  it("refuses edits to an approved email", async () => {
    const campaignId = await sampleCampaign();
    await submitForApproval(t.db, { workspaceId, campaignId });
    await approveCampaign(t.db, { workspaceId, campaignId, userId, channel: "app" });
    const [e] = await emailsOf(campaignId);
    await expect(
      t.db.update(emailMessage).set({ body: "Something nobody approved" }).where(eq(emailMessage.id, e.id)),
    ).rejects.toThrow();
    await expect(
      t.db.update(emailMessage).set({ status: "draft", approvalId: null }).where(eq(emailMessage.id, e.id)),
    ).rejects.toThrow();
  });

  it("keeps approval records append-only, but lets a campaign be deleted", async () => {
    const campaignId = await sampleCampaign();
    await submitForApproval(t.db, { workspaceId, campaignId });
    await approveCampaign(t.db, { workspaceId, campaignId, userId, channel: "app" });
    await expect(t.db.update(approval).set({ emailCount: 999 })).rejects.toThrow();
    await t.db.delete(campaign).where(and(eq(campaign.id, campaignId), eq(campaign.workspaceId, workspaceId)));
    expect(await t.db.select().from(approval)).toHaveLength(0);
  });
});
