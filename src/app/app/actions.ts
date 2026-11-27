"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

export type WorkspaceFormState = { error?: string };

export async function createWorkspace(_prev: WorkspaceFormState, form: FormData): Promise<WorkspaceFormState> {
  const name = String(form.get("name") ?? "").trim();
  if (name.length < 2) return { error: "Give the workspace a name of at least 2 characters." };

  const auth = getAuth();
  const h = await headers();
  const base = slugify(name) || "workspace";
  // Slugs are unique. Add a short suffix if the plain one is taken.
  const slug = `${base}-${crypto.randomUUID().slice(0, 6)}`;
  try {
    await auth.api.createOrganization({ body: { name, slug }, headers: h });
  } catch {
    return { error: "We couldn't create the workspace. Try again." };
  }
  redirect("/app");
}

export async function signOut() {
  await getAuth().api.signOut({ headers: await headers() });
  redirect("/sign-in");
}
