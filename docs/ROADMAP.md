# Build roadmap

How the phases in [plan/product-plan-explee.md](plan/product-plan-explee.md) turn into engineering work. The plan sets the what and the dates; this file tracks the order we build in and what's done. Update it in the same PR as the work.

Dates are the plan's targets from 1 December 2026.

## Phase 0: clean up and foundations (1 to 14 Dec 2026)

| Work | Status |
|------|--------|
| App scaffold: Next.js on Netlify, Supabase Postgres via Drizzle, Better Auth, workspaces | In review (this PR) |
| Event tracking for every agent step (`agent_event` table, `trackAgentStep`, `withAgentStep`) | In review (this PR) |
| CI: lint, typecheck, tests, migration drift check, build | In review (this PR) |
| Fix the 5 site claims (rating and user count, calls and Aircall, "2 months free", WhatsApp approvals, Inbound Labs wording) | Blocked: website code isn't in this repo |
| Pricing: contact data included up to a cap (D6). Set the cap from provider cost per verified contact | Waiting on cost figures |
| Pricing: Flex pay as you go | Waiting on Om |
| Worker host for the queue, Sender tick, inbox sync | Waiting on Om |
| Deploy: Netlify site, Supabase project, environment variables | Next |

Exit test: every public claim matches the approved list in [brand/brand-voice.md](brand/brand-voice.md).

## Phase 1: parity core (15 Dec 2026 to 7 Feb 2027)

Exit test: a new user goes from URL to approved first campaign in under 15 minutes.

Suggested build order, each its own PR:

1. **Approval ledger and U1.** Campaign, email and approval tables. The Sender refuses any email without an approval record, enforced in the database, not only in code. Nothing sends on a timer. This comes first because every later feature writes into it.
2. **Background worker.** Job queue (pg-boss on the same Postgres) and the worker process on the chosen host.
3. **P1 one-field start.** Researcher reads a URL (or a 3-question form) and builds a business profile in under 2 minutes.
4. **P2 free lead preview.** Segments with fit scores and 10 sample decision makers, before signup and with no card.
5. **P3 contact data.** Provider integration with per-contact metering against each plan's included count (D6).
6. **P9 CSV import.** Up to 30,000 rows with per-row outcomes.
7. **P6 languages.** Language chosen per segment; Writer writes in it.
8. **U3 spend caps.** Hard monthly cap, charge preview, running total, one-click cancel.
9. **P8 replies and booking.** Closer answers, proposes times and books into Google or Outlook calendars.

## Phase 2: trust upgrade (8 Feb to 31 Mar 2027)

U2 claim check, U4 sender identity per market, U5 language QA, U8 reply labels, U9 meeting brief, P7 budget follows results, P11 HubSpot app, U12 two-way CRM sync.

Exit test: early-access users book meetings; reply-label precision checked on a sample.

## Phase 3: reach and scale (April to May 2027)

U6 email, LinkedIn and visitors in one flow, U7 signals, U10 no-show recovery, U11 agency workspaces, P4 local-business data, P5 market explorer, P10 public API, U13 MCP server, U14 weekly memo, P12 regional data pages.

Exit test: leave early access and publish the Explee comparison page.
