import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "@/db/schema";

/** A fresh in-memory Postgres with every migration in ./drizzle applied. */
export async function createTestDb() {
  const client = new PGlite();
  const db = drizzle(client, { schema, casing: "snake_case" });
  await migrate(db, { migrationsFolder: "./drizzle" });
  return { db, close: () => client.close() };
}

export async function seedWorkspace(db: Awaited<ReturnType<typeof createTestDb>>["db"], id = "ws_test") {
  await db.insert(schema.organization).values({ id, name: "Test workspace", slug: id });
  return id;
}
