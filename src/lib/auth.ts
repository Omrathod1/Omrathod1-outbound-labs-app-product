import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "@/db";
import { authOptions } from "@/lib/auth-config";
import { env } from "@/lib/env";

function createAuth() {
  const base = authOptions(getDb(), {
    secret: env().BETTER_AUTH_SECRET,
    baseURL: env().BETTER_AUTH_URL,
  });
  // nextCookies must be the last plugin so server actions can set cookies.
  return betterAuth({ ...base, plugins: [...base.plugins, nextCookies()] });
}

type Auth = ReturnType<typeof createAuth>;
const globalForAuth = globalThis as unknown as { auth?: Auth };

export function getAuth(): Auth {
  globalForAuth.auth ??= createAuth();
  return globalForAuth.auth;
}
