// Campaigns and the approval ledger (U1: approval that never times out).
//
// The rule "no email leaves without an approval record" is enforced by the
// database, not only by app code:
//   - email_message has a CHECK: queued or sent rows must carry approval_id.
//   - (approval_id, campaign_id) is a foreign key into approval, so an
//     approval can only cover emails of its own campaign.
//   - a trigger (see drizzle/0002_approved_email_is_frozen.sql) blocks edits to the subject or body
//     of an approved email, so what sends is exactly what was approved.
// Nothing in the schema changes status on a timer.
import { sql } from "drizzle-orm";
import {
  check,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";

export const CAMPAIGN_STATUSES = ["draft", "awaiting_approval", "approved", "paused", "completed"] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const EMAIL_STATUSES = ["draft", "approved", "removed", "queued", "sent", "failed"] as const;
export type EmailStatus = (typeof EMAIL_STATUSES)[number];

export const APPROVAL_CHANNELS = ["app", "email", "slack"] as const;
export type ApprovalChannel = (typeof APPROVAL_CHANNELS)[number];

export const campaignStatusEnum = pgEnum("campaign_status", CAMPAIGN_STATUSES);
export const emailStatusEnum = pgEnum("email_status", EMAIL_STATUSES);
export const approvalChannelEnum = pgEnum("approval_channel", APPROVAL_CHANNELS);

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const campaign = pgTable(
  "campaign",
  {
    id: uuid().primaryKey().defaultRandom(),
    workspaceId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text().notNull(),
    status: campaignStatusEnum().notNull().default("draft"),
    /** Set when someone pauses the campaign, shown in the app. */
    pausedReason: text(),
    ...timestamps,
  },
  (t) => [index().on(t.workspaceId, t.status)],
);

export const lead = pgTable(
  "lead",
  {
    id: uuid().primaryKey().defaultRandom(),
    workspaceId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    campaignId: uuid()
      .notNull()
      .references(() => campaign.id, { onDelete: "cascade" }),
    email: text().notNull(),
    firstName: text(),
    lastName: text(),
    company: text(),
    title: text(),
    /** Set when a person removes the lead at approval. Its emails are removed too. */
    removedAt: timestamp({ withTimezone: true }),
    removedById: text().references(() => user.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [index().on(t.campaignId), unique().on(t.campaignId, t.email)],
);

export const approval = pgTable(
  "approval",
  {
    id: uuid().primaryKey().defaultRandom(),
    workspaceId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    campaignId: uuid()
      .notNull()
      .references(() => campaign.id, { onDelete: "cascade" }),
    approvedById: text()
      .notNull()
      .references(() => user.id),
    channel: approvalChannelEnum().notNull(),
    /** How many emails this approval covered, for the audit trail. */
    emailCount: integer().notNull(),
    approvedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index().on(t.campaignId), unique("approval_id_campaign_unique").on(t.id, t.campaignId)],
);

export const emailMessage = pgTable(
  "email_message",
  {
    id: uuid().primaryKey().defaultRandom(),
    workspaceId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    campaignId: uuid()
      .notNull()
      .references(() => campaign.id, { onDelete: "cascade" }),
    leadId: uuid()
      .notNull()
      .references(() => lead.id, { onDelete: "cascade" }),
    /** 1 for the first email, 2+ for follow-ups. */
    sequenceStep: integer().notNull().default(1),
    subject: text().notNull(),
    body: text().notNull(),
    status: emailStatusEnum().notNull().default("draft"),
    approvalId: uuid(),
    queuedAt: timestamp({ withTimezone: true }),
    sentAt: timestamp({ withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index().on(t.campaignId, t.status),
    index().on(t.leadId),
    foreignKey({
      name: "email_message_approval_same_campaign_fk",
      columns: [t.approvalId, t.campaignId],
      foreignColumns: [approval.id, approval.campaignId],
    }),
    check(
      "email_message_send_requires_approval",
      sql`${t.status} not in ('approved', 'queued', 'sent') or ${t.approvalId} is not null`,
    ),
  ],
);
