import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { db?: Database };

function createDb(): Database {
  // Supabase's transaction pooler doesn't support prepared statements.
  const client = postgres(env().DATABASE_URL, { prepare: false, max: 5 });
  return drizzle(client, { schema, casing: "snake_case" });
}

/** One client per server process, reused across hot reloads in dev. */
export function getDb(): Database {
  globalForDb.db ??= createDb();
  return globalForDb.db;
}
