// One row per agent step, for every run. Phase 0 asks for this so that
// activation time, cost per meeting and "emails sent without an approval
// record" can be measured from day one. Rows are append-only.
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organization } from "./auth";

export const AGENTS = [
  "researcher",
  "strategist",
  "prospector",
  "writer",
  "sender",
  "closer",
  "platform",
] as const;
export type Agent = (typeof AGENTS)[number];

export const STEP_STATUSES = ["succeeded", "failed", "skipped"] as const;
export type StepStatus = (typeof STEP_STATUSES)[number];

export const agentEnum = pgEnum("agent", AGENTS);
export const stepStatusEnum = pgEnum("agent_step_status", STEP_STATUSES);

export const agentEvent = pgTable(
  "agent_event",
  {
    id: uuid().primaryKey().defaultRandom(),
    workspaceId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    /** Groups the steps of one agent run, e.g. one Prospector pass. */
    runId: text().notNull(),
    campaignId: text(),
    agent: agentEnum().notNull(),
    /** Dotted step name, e.g. "profile.build" or "email.send". */
    step: text().notNull(),
    status: stepStatusEnum().notNull(),
    durationMs: integer(),
    /** How many things the step produced or touched (emails, contacts). */
    count: integer(),
    /** Provider cost of the step in micro-dollars (1,000,000 = $1). */
    costMicros: integer(),
    error: text(),
    /** Small, non-secret details. Never put contact data or tokens here. */
    metadata: jsonb().$type<Record<string, unknown>>().notNull().default({}),
    occurredAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index().on(t.workspaceId, t.occurredAt), index().on(t.runId)],
);
