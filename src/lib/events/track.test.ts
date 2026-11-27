import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { agentEvent } from "@/db/schema";
import { createTestDb, seedWorkspace } from "../../../test/db";
import { trackAgentStep, withAgentStep } from "./track";

let t: Awaited<ReturnType<typeof createTestDb>>;
let workspaceId: string;

beforeEach(async () => {
  t = await createTestDb();
  workspaceId = await seedWorkspace(t.db);
});
afterEach(async () => {
  await t.close();
});

describe("trackAgentStep", () => {
  it("stores a valid step", async () => {
    const row = await trackAgentStep(t.db, {
      workspaceId,
      runId: "run_1",
      agent: "prospector",
      step: "contacts.verify",
      status: "succeeded",
      count: 3104,
    });
    expect(row.agent).toBe("prospector");
    expect(row.count).toBe(3104);
    expect(row.metadata).toEqual({});
  });

  it("rejects a step name that isn't dotted lower case", async () => {
    await expect(
      trackAgentStep(t.db, { workspaceId, runId: "r", agent: "writer", step: "Write Email", status: "succeeded" }),
    ).rejects.toThrow(/dotted lower case/);
  });

  it("rejects an unknown agent", async () => {
    await expect(
      // @ts-expect-error unknown agent on purpose
      trackAgentStep(t.db, { workspaceId, runId: "r", agent: "caller", step: "call", status: "succeeded" }),
    ).rejects.toThrow();
  });
});

describe("withAgentStep", () => {
  it("records success with duration and count", async () => {
    let clock = 1000;
    const value = await withAgentStep(
      t.db,
      { workspaceId, runId: "run_2", agent: "writer", step: "email.draft" },
      async () => {
        clock += 250;
        return { value: "ok", count: 12 };
      },
      () => clock,
    );
    expect(value).toBe("ok");
    const [row] = await t.db.select().from(agentEvent).where(eq(agentEvent.runId, "run_2"));
    expect(row).toMatchObject({ status: "succeeded", durationMs: 250, count: 12 });
  });

  it("records failure and rethrows", async () => {
    await expect(
      withAgentStep(t.db, { workspaceId, runId: "run_3", agent: "sender", step: "email.send" }, async () => {
        throw new Error("mailbox paused: bounce rate passed 2%");
      }),
    ).rejects.toThrow("mailbox paused");
    const [row] = await t.db.select().from(agentEvent).where(eq(agentEvent.runId, "run_3"));
    expect(row.status).toBe("failed");
    expect(row.error).toBe("mailbox paused: bounce rate passed 2%");
  });
});
