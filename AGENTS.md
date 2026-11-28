<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- Read `docs/plan/product-plan-explee.md` before building a feature, and update `docs/ROADMAP.md` in the same PR.
- All user-facing copy follows `docs/brand/brand-voice.md`: plain words, figures for numbers, no exclamation marks or emoji, no banned words, and only approved claims. Error states say what broke, whether anything sent, and the next step.
- Colours, type and components follow `docs/brand/brand-guide.md`. Use the tokens in `src/app/globals.css`. One primary button per view. Mint is for success states only.
- Nothing may send without an approval record. Never add an auto-send on timeout.
- Every agent step records an `agent_event` row via `withAgentStep` or `trackAgentStep`.
- Schema changes go in `src/db/schema` with a generated migration (`npm run db:generate`); CI fails if they drift.
- Session reads must sit behind a `<Suspense>` boundary (Cache Components). Read `headers()` before touching env or the database so prerendering stops early.
