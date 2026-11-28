import type { CampaignStatus } from "@/db/schema";

const styles: Record<CampaignStatus, { label: string; className: string }> = {
  draft: { label: "draft", className: "text-dim border-hairline" },
  awaiting_approval: { label: "needs approval", className: "text-amber border-orange/40" },
  approved: { label: "approved", className: "text-mint border-mint/40" },
  paused: { label: "paused", className: "text-soft border-hairline" },
  completed: { label: "completed", className: "text-dim border-hairline" },
};

export function StatusPill({ status }: { status: CampaignStatus }) {
  const s = styles[status];
  return (
    <span className={`inline-flex self-start rounded-full border px-2.5 py-0.5 font-mono text-xs ${s.className}`}>{s.label}</span>
  );
}
