import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

/** The signed-in user and session, or a redirect to sign-in. */
export async function requireSession() {
  // Read the request first so prerendering stops here, before any
  // environment or database access.
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session) redirect("/sign-in");
  return session;
}
