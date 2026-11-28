import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { StatusPill } from "@/components/status-pill";
import { getDb } from "@/db";
import { getCampaignReview } from "@/lib/campaigns/queries";
import { requireSession } from "@/lib/session";
import { ActionButton } from "../action-button";
import { approveAction, pauseAction, removeEmailAction, removeLeadAction, resumeAction } from "../actions";

export const metadata: Metadata = { title: "Campaign" };

export default function CampaignPage({ params }: PageProps<"/app/campaigns/[id]">) {
  return (
    <>
      <Link href="/app" className="text-sm text-sky hover:underline">
        ← All campaigns
      </Link>
      <Suspense fallback={<p className="mt-6 text-dim">Loading the campaign</p>}>
        <Review params={params} />
      </Suspense>
    </>
  );
}

const plural = (n: number, one: string, many: string) => `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;

async function Review({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session } = await requireSession();
  if (!session.activeOrganizationId) redirect("/app");
  if (!z.string().uuid().safeParse(id).success) notFound();

  const review = await getCampaignReview(getDb(), session.activeOrganizationId, id);
  if (!review) notFound();
  const { campaign: c, leads, approvals } = review;

  const reviewing = c.status === "awaiting_approval";
  const liveLeads = leads.filter((l) => !l.removedAt);
  const toApprove = liveLeads.flatMap((l) => l.emails).filter((e) => e.status === "draft").length;
  const fields = { campaignId: c.id };

  return (
    <section className="rise-in mt-6 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <StatusPill status={c.status} />
        <h1 className="text-[40px] leading-tight font-[450] tracking-[-0.03em]">{c.name}</h1>
        {reviewing && (
          <p className="text-[19px] text-soft">
            {plural(toApprove, "email", "emails")} to {plural(liveLeads.length, "lead", "leads")}. Nothing sends until you
            approve. Remove any lead or email you don&apos;t want first.
          </p>
        )}
        {c.status === "approved" && (
          <p className="text-[19px] text-soft">Approved. The Sender sends only the emails below, exactly as approved.</p>
        )}
        {c.status === "paused" && (
          <p className="text-[19px] text-soft">
            {c.pausedReason ?? "Paused."} Nothing else will send until you resume.
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-3">
          {reviewing && (
            <ActionButton
              action={approveAction}
              fields={fields}
              variant="primary"
              label={`Approve ${plural(toApprove, "email", "emails")}`}
              pendingLabel="Approving"
            />
          )}
          {c.status === "approved" && (
            <ActionButton action={pauseAction} fields={fields} label="Pause campaign" pendingLabel="Pausing" />
          )}
          {c.status === "paused" && (
            <ActionButton action={resumeAction} fields={fields} variant="primary" label="Resume campaign" pendingLabel="Resuming" />
          )}
        </div>
      </div>

      <ol className="flex flex-col gap-4">
        {leads.map((l) => (
          <li
            key={l.id}
            className={`rounded-[18px] border border-hairline p-6 ${l.removedAt ? "opacity-50" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[19px] font-medium tracking-[-0.015em]">
                  {[l.firstName, l.lastName].filter(Boolean).join(" ") || l.email}
                </h2>
                <p className="text-sm text-soft">
                  {[l.title, l.company].filter(Boolean).join(", ")}
                  <span className="ml-2 font-mono text-dim">{l.email}</span>
                </p>
              </div>
              {l.removedAt ? (
                <span className="text-sm text-dim">Removed. Nothing will be sent to this lead.</span>
              ) : (
                reviewing && (
                  <ActionButton
                    action={removeLeadAction}
                    fields={{ ...fields, leadId: l.id }}
                    label="Remove lead"
                    pendingLabel="Removing"
                  />
                )
              )}
            </div>
            <ol className="mt-4 flex flex-col gap-3">
              {l.emails.map((e) => (
                <li key={e.id} className={`rounded-[10px] border border-hairline p-4 ${e.status === "removed" ? "opacity-50" : ""}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="label">
                      {e.sequenceStep === 1 ? "First email" : `Follow-up ${e.sequenceStep - 1}`} · {e.status}
                    </p>
                    {reviewing && e.status === "draft" && !l.removedAt && (
                      <ActionButton
                        action={removeEmailAction}
                        fields={{ ...fields, emailId: e.id }}
                        label="Remove email"
                        pendingLabel="Removing"
                      />
                    )}
                  </div>
                  <p className="mt-2 font-medium">{e.subject}</p>
                  <p className="mt-1 whitespace-pre-line text-soft">{e.body}</p>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>

      {approvals.length > 0 && (
        <div className="rounded-[18px] border border-hairline p-6">
          <h2 className="text-[19px] font-medium tracking-[-0.015em]">Approval record</h2>
          <ul className="mt-3 flex flex-col gap-1 font-mono text-sm text-soft">
            {approvals.map((a) => (
              <li key={a.id}>
                <span className="text-mint">✓</span> {a.approvedBy} approved {plural(a.emailCount, "email", "emails")} in the{" "}
                {a.channel} · {a.approvedAt.toISOString().slice(0, 16).replace("T", " ")} UTC
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
