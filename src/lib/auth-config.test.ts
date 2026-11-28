import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { betterAuth } from "better-auth";
import { createTestDb } from "../../test/db";
import { authOptions } from "./auth-config";

let t: Awaited<ReturnType<typeof createTestDb>>;

beforeEach(async () => {
  t = await createTestDb();
});
afterEach(async () => {
  await t.close();
});

// Proves the hand-written Drizzle schema matches what Better Auth expects.
describe("auth against the migrated schema", () => {
  it("signs up, creates a workspace and makes the creator its owner", async () => {
    const auth = betterAuth(
      authOptions(t.db, { secret: "test-secret-test-secret-test-secret!", baseURL: "http://localhost:3000" }),
    );

    const signUp = await auth.api.signUpEmail({
      body: { name: "Dana Ruiz", email: "dana@example.com", password: "correct horse battery" },
      returnHeaders: true,
    });
    const cookie = signUp.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("better-auth.session_token");
    const headers = new Headers({ cookie: cookie.split(";")[0] });

    const ws = await auth.api.createOrganization({
      body: { name: "Kestrel Supply", slug: "kestrel-supply" },
      headers,
    });
    expect(ws?.slug).toBe("kestrel-supply");

    const full = await auth.api.getFullOrganization({ query: { organizationId: ws!.id }, headers });
    expect(full?.members).toHaveLength(1);
    expect(full?.members[0].role).toBe("owner");

    const session = await auth.api.getSession({ headers });
    expect(session?.session.activeOrganizationId).toBe(ws!.id);
  });

  it("starts a new session in the user's first workspace", async () => {
    const auth = betterAuth(
      authOptions(t.db, { secret: "test-secret-test-secret-test-secret!", baseURL: "http://localhost:3000" }),
    );
    const body = { name: "Dana Ruiz", email: "dana@example.com", password: "correct horse battery" };
    const signUp = await auth.api.signUpEmail({ body, returnHeaders: true });
    const headers = new Headers({ cookie: (signUp.headers.get("set-cookie") ?? "").split(";")[0] });
    const ws = await auth.api.createOrganization({ body: { name: "Kestrel", slug: "kestrel" }, headers });

    const signIn = await auth.api.signInEmail({
      body: { email: body.email, password: body.password },
      returnHeaders: true,
    });
    const fresh = new Headers({ cookie: (signIn.headers.get("set-cookie") ?? "").split(";")[0] });
    const session = await auth.api.getSession({ headers: fresh });
    expect(session?.session.activeOrganizationId).toBe(ws!.id);
  });

  it("rejects a short password", async () => {
    const auth = betterAuth(
      authOptions(t.db, { secret: "test-secret-test-secret-test-secret!", baseURL: "http://localhost:3000" }),
    );
    await expect(
      auth.api.signUpEmail({ body: { name: "A", email: "a@example.com", password: "short" } }),
    ).rejects.toThrow();
  });
});
