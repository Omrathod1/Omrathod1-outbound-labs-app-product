import { and, asc, desc, eq, sql } from "drizzle-orm";
import { approval, campaign, emailMessage, lead, user } from "@/db/schema";
import type { EventDb } from "@/lib/events/track";

/** Campaigns in a workspace with email counts by status, newest first. */
export async function listCampaigns(db: EventDb, workspaceId: string) {
  return db
    .select({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      pausedReason: campaign.pausedReason,
      createdAt: campaign.createdAt,
      toReview: sql<number>`count(${emailMessage.id}) filter (where ${emailMessage.status} = 'draft')`.mapWith(Number),
      approved: sql<number>`count(${emailMessage.id}) filter (where ${emailMessage.status} in ('approved', 'queued', 'sent'))`.mapWith(Number),
    })
    .from(campaign)
    .leftJoin(emailMessage, eq(emailMessage.campaignId, campaign.id))
    .where(eq(campaign.workspaceId, workspaceId))
    .groupBy(campaign.id)
    .orderBy(desc(campaign.createdAt));
}

/** One campaign with its leads, their emails and the approval history. */
export async function getCampaignReview(db: EventDb, workspaceId: string, campaignId: string) {
  const [c] = await db
    .select()
    .from(campaign)
    .where(and(eq(campaign.id, campaignId), eq(campaign.workspaceId, workspaceId)));
  if (!c) return null;

  const [leads, emails, approvals] = await Promise.all([
    db.select().from(lead).where(eq(lead.campaignId, c.id)).orderBy(asc(lead.createdAt)),
    db
      .select()
      .from(emailMessage)
      .where(eq(emailMessage.campaignId, c.id))
      .orderBy(asc(emailMessage.sequenceStep)),
    db
      .select({
        id: approval.id,
        channel: approval.channel,
        emailCount: approval.emailCount,
        approvedAt: approval.approvedAt,
        approvedBy: user.name,
      })
      .from(approval)
      .innerJoin(user, eq(user.id, approval.approvedById))
      .where(eq(approval.campaignId, c.id))
      .orderBy(desc(approval.approvedAt)),
  ]);

  return {
    campaign: c,
    approvals,
    leads: leads.map((l) => ({ ...l, emails: emails.filter((e) => e.leadId === l.id) })),
  };
}
