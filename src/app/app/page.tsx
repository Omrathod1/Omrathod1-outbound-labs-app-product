import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { desc, eq } from "drizzle-orm";
import { StatusPill } from "@/components/status-pill";
import { getDb } from "@/db";
import { agentEvent, organization } from "@/db/schema";
import { listCampaigns } from "@/lib/campaigns/queries";
import { requireSession } from "@/lib/session";
import { createSampleAction } from "./campaigns/actions";
import { CreateWorkspaceForm } from "./create-workspace-form";

export const metadata: Metadata = { title: "Workspace" };

export default function AppPage() {
  return (
    <Suspense fallback={<p className="text-dim">Loading your workspace</p>}>
      <Workspace />
    </Suspense>
  );
}

const plural = (n: number, one: string, many: string) => `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;

async function Workspace() {
  const { session } = await requireSession();
  const workspaceId = session.activeOrganizationId;

  if (!workspaceId) {
    return (
      <section className="rise-in">
        <p className="label">Step 1</p>
        <h1 className="mt-2 text-[40px] leading-tight font-[450] tracking-[-0.03em]">Name your workspace</h1>
        <p className="mt-2 text-[19px] text-soft">Campaigns, mailboxes and approvals live in a workspace.</p>
        <CreateWorkspaceForm />
      </section>
    );
  }

  const db = getDb();
  const [[workspace], campaigns, events] = await Promise.all([
    db.select().from(organization).where(eq(organization.id, workspaceId)).limit(1),
    listCampaigns(db, workspaceId),
    db
      .select()
      .from(agentEvent)
      .where(eq(agentEvent.workspaceId, workspaceId))
      .orderBy(desc(agentEvent.occurredAt))
      .limit(20),
  ]);
  const waiting = campaigns.filter((c) => c.status === "awaiting_approval").length;

  return (
    <section className="rise-in flex flex-col gap-10">
      <div>
        <p className="label">Workspace</p>
        <h1 className="mt-2 text-[40px] leading-tight font-[450] tracking-[-0.03em]">{workspace?.name}</h1>
        {waiting > 0 && (
          <p className="mt-2 text-[19px] text-soft">{plural(waiting, "campaign", "campaigns")} waiting for your approval.</p>
        )}
      </div>

      <div className="rounded-[18px] border border-hairline p-6">
        <h2 className="text-[19px] font-medium tracking-[-0.015em]">Campaigns</h2>
        {campaigns.length === 0 ? (
          <div className="mt-1 flex flex-col items-start gap-4">
            <p className="text-soft">No campaigns yet. Nothing sends until you approve it.</p>
            <form action={createSampleAction}>
              <button
                type="submit"
                className="rounded-[10px] border border-hairline px-3 py-1.5 text-sm text-soft hover:text-ink"
              >
                Try approval with a sample campaign
              </button>
            </form>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-hairline">
            {campaigns.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/app/campaigns/${c.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 hover:text-sky"
                >
                  <span>{c.name}</span>
                  <span className="flex items-center gap-3 text-sm text-dim">
                    {c.status === "awaiting_approval"
                      ? `${plural(c.toReview, "email", "emails")} to review`
                      : `${plural(c.approved, "email", "emails")} approved`}
                    <StatusPill status={c.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[18px] border border-hairline p-6">
        <h2 className="text-[19px] font-medium tracking-[-0.015em]">Agent activity</h2>
        {events.length === 0 ? (
          <p className="mt-1 text-soft">No agent runs yet. Every step the agents take will show here.</p>
        ) : (
          <ol className="mt-4 flex flex-col gap-1 overflow-x-auto font-mono text-sm">
            {events.map((e) => (
              <li key={e.id} className="flex gap-3 whitespace-nowrap">
                <span className={e.status === "succeeded" ? "text-mint" : e.status === "failed" ? "text-amber" : "text-dim"}>
                  {e.status === "succeeded" ? "✓" : e.status === "failed" ? "✕" : "·"}
                </span>
                <span className="text-soft">{e.agent}</span>
                <span>{e.step}</span>
                {e.count != null && <span className="text-dim">{e.count.toLocaleString("en-US")}</span>}
                {e.error && <span className="text-amber">{e.error}</span>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
