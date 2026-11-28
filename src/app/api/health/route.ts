import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "@/db";

// Used by uptime checks. Reports whether the app can reach Postgres.
export async function GET() {
  await connection();
  try {
    await getDb().execute(sql`select 1`);
    return Response.json({ ok: true, db: "up" });
  } catch {
    return Response.json({ ok: false, db: "down" }, { status: 503 });
  }
}
