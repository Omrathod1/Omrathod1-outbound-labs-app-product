# Decisions

Product and engineering decisions, newest last. Add a row when Om decides something; don't rewrite old rows, add a new one that replaces them.

| # | Date | Decision | Notes |
|---|------|----------|-------|
| D1 | 2026-11-06 | The web app runs on Netlify | `netlify.toml` |
| D2 | 2026-11-06 | Supabase is used as plain Postgres through Drizzle. No Supabase Auth or client library | Use the transaction pooler; prepared statements are off in `src/db/index.ts` |
| D3 | 2026-11-06 | Better Auth for sign-in | Workspaces use Better Auth's organization plugin |
| D4 | 2026-11-27 | Workspaces are Better Auth organizations; one login can belong to many | Leaves room for agency workspaces (U11) without a migration |
| D5 | 2026-11-27 | Every agent step writes one `agent_event` row | Phase 0 event tracking; feeds activation, cost per meeting and the "no send without approval" check |
| D6 | 2026-11-27 | Contact data is included in plans, up to a capped number of verified contacts | Cap set from real provider cost so data stays under about 30% of plan revenue. The brand voice rule "never say lead data is included" and the approved claims list must change before the site does |

## Open

| Question | Options | Recommended |
|----------|---------|-------------|
| Where the always-on worker runs (queue, Sender tick every minute, inbox sync) | Railway, Fly.io, Netlify functions only | Railway |
| Flex pay as you go | Launch with a required monthly cap; stay subscription only | Launch |
| Calls and Aircall on the site | Narrow form; drop | Drop |
| Sending domains | Lookalike domains per customer; shared warmed pool | Per customer |
| First paid segment | Founders; agencies | Founders |
