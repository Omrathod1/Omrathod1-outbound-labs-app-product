import { z } from "zod";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { AGENTS, STEP_STATUSES, agentEvent } from "@/db/schema";
import type * as schema from "@/db/schema";

/** Any Drizzle Postgres database built with our schema (postgres.js in the app, PGlite in tests). */
export type EventDb = PgDatabase<PgQueryResultHKT, typeof schema>;

const stepName = z
  .string()
  .regex(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/, "step must be dotted lower case, e.g. email.send");

export const agentStepSchema = z.object({
  workspaceId: z.string().min(1),
  runId: z.string().min(1),
  campaignId: z.string().min(1).optional(),
  agent: z.enum(AGENTS),
  step: stepName,
  status: z.enum(STEP_STATUSES),
  durationMs: z.number().int().nonnegative().optional(),
  count: z.number().int().nonnegative().optional(),
  costMicros: z.number().int().nonnegative().optional(),
  error: z.string().max(2000).optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type AgentStepInput = z.input<typeof agentStepSchema>;

/** Record one finished agent step. Validates first, so bad events fail loudly in development. */
export async function trackAgentStep(db: EventDb, input: AgentStepInput) {
  const event = agentStepSchema.parse(input);
  const [row] = await db.insert(agentEvent).values(event).returning();
  return row;
}

type StepContext = Omit<AgentStepInput, "status" | "durationMs" | "error">;
type StepResult<T> = { value: T; count?: number; costMicros?: number };

/**
 * Run an agent step and record how it went: succeeded with its duration,
 * or failed with the error message. The original error is rethrown.
 */
export async function withAgentStep<T>(
  db: EventDb,
  ctx: StepContext,
  fn: () => Promise<StepResult<T>>,
  now: () => number = Date.now,
): Promise<T> {
  const started = now();
  try {
    const result = await fn();
    await trackAgentStep(db, {
      ...ctx,
      status: "succeeded",
      durationMs: now() - started,
      count: result.count ?? ctx.count,
      costMicros: result.costMicros ?? ctx.costMicros,
    });
    return result.value;
  } catch (err) {
    await trackAgentStep(db, {
      ...ctx,
      status: "failed",
      durationMs: now() - started,
      error: err instanceof Error ? err.message.slice(0, 2000) : String(err).slice(0, 2000),
    });
    throw err;
  }
}
