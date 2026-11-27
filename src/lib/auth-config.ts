import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { asc, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import type { EventDb } from "@/lib/events/track";

/**
 * Better Auth settings shared by the app and the tests. Workspaces are
 * Better Auth organizations: one login can belong to many workspaces,
 * which the agency plan (U11) builds on.
 */
export function authOptions(db: EventDb, opts: { secret: string; baseURL: string }) {
  return {
    secret: opts.secret,
    baseURL: opts.baseURL,
    database: drizzleAdapter(db, { provider: "pg", schema }),
    emailAndPassword: { enabled: true, minPasswordLength: 10 },
    plugins: [organization()],
    databaseHooks: {
      session: {
        create: {
          // A new session starts in the user's first workspace, so signing
          // back in doesn't drop them on the "name your workspace" step.
          before: async (session) => {
            const [first] = await db
              .select({ organizationId: schema.member.organizationId })
              .from(schema.member)
              .where(eq(schema.member.userId, session.userId))
              .orderBy(asc(schema.member.createdAt))
              .limit(1);
            return { data: { ...session, activeOrganizationId: first?.organizationId ?? null } };
          },
        },
      },
    },
  } satisfies BetterAuthOptions;
}
