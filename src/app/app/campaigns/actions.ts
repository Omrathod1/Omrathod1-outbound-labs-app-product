"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import {
  LedgerError,
  approveCampaign,
  pauseCampaign,
  removeEmail,
  removeLead,
  resumeCampaign,
} from "@/lib/campaigns/ledger";
import { createSampleCampaign } from "@/lib/campaigns/sample";
import { requireSession } from "@/lib/session";

export type ActionState = { error?: string };

const id = z.string().uuid();

/** Signed-in user and their active workspace, or a redirect. */
async function context() {
  const { session, user } = await requireSession();
  if (!session.activeOrganizationId) redirect("/app");
  return { userId: user.id, workspaceId: session.activeOrganizationId };
}

async function run(fn: () => Promise<unknown>): Promise<ActionState> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof LedgerError) return { error: err.message };
    if (err instanceof z.ZodError) return { error: "That link isn't valid. Reload the page and try again." };
    throw err;
  }
  refresh();
  return {};
}

export async function approveAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { userId, workspaceId } = await context();
  return run(() =>
    approveCampaign(getDb(), { workspaceId, userId, campaignId: id.parse(form.get("campaignId")), channel: "app" }),
  );
}

export async function removeLeadAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { userId, workspaceId } = await context();
  return run(() =>
    removeLead(getDb(), {
      workspaceId,
      userId,
      campaignId: id.parse(form.get("campaignId")),
      leadId: id.parse(form.get("leadId")),
    }),
  );
}

export async function removeEmailAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { workspaceId } = await context();
  return run(() =>
    removeEmail(getDb(), {
      workspaceId,
      campaignId: id.parse(form.get("campaignId")),
      emailId: id.parse(form.get("emailId")),
    }),
  );
}

export async function pauseAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { workspaceId } = await context();
  return run(() =>
    pauseCampaign(getDb(), { workspaceId, campaignId: id.parse(form.get("campaignId")), reason: "Paused by you." }),
  );
}

export async function resumeAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { workspaceId } = await context();
  return run(() => resumeCampaign(getDb(), { workspaceId, campaignId: id.parse(form.get("campaignId")) }));
}

export async function createSampleAction(): Promise<void> {
  const { workspaceId } = await context();
  const c = await createSampleCampaign(getDb(), workspaceId);
  redirect(`/app/campaigns/${c.id}`);
}
