# Outbound Labs app

The product app for Outbound Labs: six AI agents find a company's buyers, write and send cold email, and book meetings, with a person approving every campaign.

Read [docs/](docs/README.md) first. The plan says what to build, the brand docs say how it looks and sounds, and [docs/ROADMAP.md](docs/ROADMAP.md) tracks the build order.

## Stack

- Next.js 16 (App Router, Cache Components) on Netlify
- Postgres on Supabase, through Drizzle ORM (`src/db`)
- Better Auth for sign-in and workspaces (`src/lib/auth*.ts`)
- Tailwind CSS 4 with the brand tokens (`src/app/globals.css`)
- Vitest, with an in-memory Postgres (PGlite) so tests need no database

## Run it locally

You need Node 22 and a Postgres database.

```bash
cp .env.example .env.local   # then fill in the values
npm install
npm run db:migrate           # applies ./drizzle to DATABASE_URL
npm run dev
```

Open http://localhost:3000. Signed-out visitors go to `/sign-in`; after sign-up you name a workspace and land on `/app`.

## Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` | Unit and database tests (PGlite, no setup) |
| `npm run db:generate` | Write a migration after changing `src/db/schema` |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` |

## Layout

```
src/app/(auth)      sign-in and sign-up
src/app/app         the signed-in app
src/app/api         Better Auth handler, health check
src/db/schema       Drizzle tables (auth, workspaces, agent events, campaigns, approvals)
src/lib/campaigns   approval ledger: approve, remove, pause, queue for the Sender
src/lib/events      agent step tracking
drizzle/            generated SQL migrations, committed
test/               test helpers
```

## Recording agent steps

Every agent step writes one row to `agent_event`. Wrap the step:

```ts
await withAgentStep(db, { workspaceId, runId, agent: "prospector", step: "contacts.verify" }, async () => {
  const verified = await verifyContacts(list);
  return { value: verified, count: verified.length };
});
```

It records success with the duration, or failure with the error, and rethrows. Keep contact data and secrets out of `metadata`.
