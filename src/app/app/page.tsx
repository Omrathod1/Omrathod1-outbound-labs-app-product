import type { Metadata } from "next";
import { Suspense } from "react";
import { desc, eq } from "drizzle-orm";
import { Wordmark } from "@/components/wordmark";
import { getDb } from "@/db";
import { agentEvent, organization } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { signOut } from "./actions";
import { CreateWorkspaceForm } from "./create-workspace-form";

export const metadata: Metadata = { title: "Workspace" };

export default function AppPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-hairline px-4 py-4 sm:px-8">
        <Wordmark className="text-lg" />
        <form action={signOut}>
          <button type="submit" className="rounded-[10px] px-3 py-1.5 text-sm text-soft hover:text-ink">
            Sign out
          </button>
        </form>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
        <Suspense fallback={<p className="text-dim">Loading your workspace</p>}>
          <Workspace />
        </Suspense>
      </main>
    </div>
  );
}

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
  const [workspace] = await db.select().from(organization).where(eq(organization.id, workspaceId)).limit(1);
  const events = await db
    .select()
    .from(agentEvent)
    .where(eq(agentEvent.workspaceId, workspaceId))
    .orderBy(desc(agentEvent.occurredAt))
    .limit(20);

  return (
    <section className="rise-in flex flex-col gap-10">
      <div>
        <p className="label">Workspace</p>
        <h1 className="mt-2 text-[40px] leading-tight font-[450] tracking-[-0.03em]">{workspace?.name}</h1>
      </div>

      <div className="rounded-[18px] border border-hairline p-6">
        <h2 className="text-[19px] font-medium tracking-[-0.015em]">Campaigns</h2>
        <p className="mt-1 text-soft">No campaigns yet. Nothing sends until you approve it.</p>
      </div>

      <div className="rounded-[18px] border border-hairline p-6">
        <h2 className="text-[19px] font-medium tracking-[-0.015em]">Agent activity</h2>
        {events.length === 0 ? (
          <p className="mt-1 text-soft">No agent runs yet. Every step the agents take will show here.</p>
        ) : (
          <ol className="mt-4 flex flex-col gap-1 font-mono text-sm">
            {events.map((e) => (
              <li key={e.id} className="flex gap-3">
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
