# Outbound Labs product plan: matching Explee, then going past it

> Source: `docs/originals/product-plan-explee.docx`, converted to Markdown on 2026-11-27. If the two differ, update this file from the latest upload.

Nov 28, 2026 · @Om

## Summary

Explee and Outbound Labs already sell the same promise: paste a website,
an AI agent finds buyers, writes and sends cold email, and books
meetings. Explee wins today on three things: lead data is free, there is
no subscription, and it has its own large company database. Outbound
Labs already wins on paper on approvals, channels (LinkedIn, visitor
ID), integrations and a clear monthly price.

The plan has two moves:

1.  **Close the three gaps** where Explee is ahead (data included, a
    no-subscription entry, market sizing and local-business data) in
    about 8 weeks.

2.  **Build the upgrade** around what Explee's own users complain about:
    sends without approval, generic or wrong copy, weak non-English
    markets, mislabelled hot leads and billing surprises. Our answer is
    the line we already own: autonomous, never unsupervised.

The pitch we earn at the end: *Everything Explee does, plus approval on
every campaign, your own sender identity in every market, LinkedIn and
website visitors in the same sequence, and a meeting brief before every
call.*

One thing to do first, this week: the current site makes claims our own
brand voice bans (a 4.8 rating, 16,000+ users, cold calls as a channel,
"2 months free"). Fix those before any comparison page goes live,
because an upgrade story only works if every claim checks out.

## Explee teardown

Explee (formerly AutoGTM, run by Explee LTD, London) calls itself a 24/7
AI agent that finds clients while you sleep. It targets B2B sellers with
no sales team. AutoGTM went public in May 2026.

### The workflow

| Step               | What Explee does                                                                                 | Our agent       |
|--------------------|--------------------------------------------------------------------------------------------------|-----------------|
| 1\. Learn          | Reads your site and studies competitors. Also offers a path for businesses with no website       | Researcher      |
| 2\. Segment        | Proposes buyer segments with fit scores (e.g. 92%, 88%, 85%)                                     | Strategist      |
| 3\. Find contacts  | Named decision makers by industry, role, size and location; only verified addresses are emailed  | Prospector      |
| 4\. Write          | A personalised subject and body per prospect, in the lead's language or 1 of 30 chosen languages | Writer          |
| 5\. Follow up      | Automatic follow-ups                                                                             | Writer + Sender |
| 6\. Reply and book | Answers questions, proposes times, sends invites or booking links                                | Closer          |
| 7\. Optimise       | Labels segments Scaling, Working or Paused by cost per lead and moves budget to winners          | (gap)           |

### Data

- Company database: 105M+ companies, 400M+ people profiles, 80M+
  decision makers (self-reported).

- Google Maps dataset: 218M+ entries, which reaches local businesses
  with no LinkedIn presence.

- Regional database pages (US, Europe, APAC, LATAM, Middle East, Africa
  and more) that double as SEO landing pages.

- Segments Explorer: a free-standing tool that maps neighbouring niches
  and sizes a TAM from company counts.

### Sending

- Explee's own pre-warmed mailboxes, not the customer's domain. SPF,
  DKIM and DMARC set up for you.

- Mailboxes that get blocklisted or bounce too often pause
  automatically.

- Claims a 97% inbox rate (self-reported).

### Pricing

- Pay as you go, no subscription. Lead finding is free.

- About \$0.04 per email, charged in batches of \$5 or more. A daily
  budget can be changed at any time.

- \$30 free credit, about 750 emails. A card is needed and a \$1 hold
  may apply.

- Headline: from \$1 per warm lead, median \$9 per hot lead. A "hot
  lead" is any reply that moves the deal forward, even with no call
  booked.

### API

A public API (v1.0.0, X-API-Key auth, 10,000 requests an hour) covers
natural-language company and people search, email and phone enrichment,
and the full outreach engine: projects, campaigns, budgets, lead import
up to 30,000, inbox threads, replies, hot-lead polling and GDPR erasure
polling. Credits are \$0.01 each. Email enrichment is 1.5 or 5 credits
per email found; phone is 15 or 30.

### Distribution

- A HubSpot marketplace app that pushes every hot lead in as a contact
  and a deal.

- An affiliate programme, which explains the many affiliate-written
  reviews.

- Social proof: a live counter (76,371 hot leads for 7,171 companies)
  and named customer results with cost per lead.

### What to copy and what not to

Copy the ideas: the one-field start, free lead preview before payment,
budget that follows performance, data pages as SEO, a TAM explorer, and
an API that exposes the whole engine. Do not copy their wording, design,
data or code, and do not pull their database through their API to seed
ours. Their terms almost certainly forbid it, and it would undercut the
honesty pillar we sell on.

## Where Explee falls short

Public reviews are few and mixed, and two of the longer ones come from a
competitor (Salesforge) and an affiliate. Treat each point as a signal
to design against, not a fact to quote in marketing. Our brand voice
only lets us state what Explee publishes, dated.

| Complaint pattern                                                                  | Seen in                                          | What it tells us to build                                        |
|------------------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------------------------------|
| Emails went out after about 2 hours without lead approval; autopilot on by default | Trustpilot, via Salesforge and affiliate reviews | Approval that never times out into sending                       |
| Users can't review leads before outreach starts                                    | Salesforge review                                | Lead-level review, not only campaign-level                       |
| Wrong offers, odd AI conversations, "AI slop" that could hurt reputation           | Trustpilot                                       | Claim-checking on every email; a grounded offer library          |
| Hungarian campaign: \$30, zero leads; English sender names, no local domain        | Trustpilot                                       | Per-market sender identity and native-language QA                |
| Replies marked as hot leads when they weren't                                      | Trustpilot                                       | An honest reply classifier, with meetings as the headline number |
| Double charges, trouble cancelling, charges after free credit runs out             | Trustpilot, affiliate review                     | Hard spend caps, charge preview, one-click cancel                |
| Email only, no LinkedIn                                                            | Salesforge review                                | Multichannel in one sequence (we have this on paper)             |
| Sends from Explee's mailboxes, not your domain                                     | Affiliate review                                 | Choice: our warmed domains or your own lookalike domains         |
| Slow dashboard, unclear bounce data                                                | Affiliate review                                 | Plain status, live counts, every pause explained                 |

Ratings at the time of writing: Trustpilot shows about 2.4 to 2.5 from 6
reviews on one regional page and about 3.6 from 41 in an affiliate's
count; G2 shows 5.0 from 5. Both samples are too small to quote.

## Outbound Labs today

### Already ahead of Explee, on the site

- Six named agents: Researcher, Strategist, Prospector, Writer, Sender,
  Closer.

- Nothing sends until you approve, in the app, by email or in Slack. Any
  campaign can be paused.

- Email and LinkedIn in one sequence, plus website visitor
  identification (company level, waits for cookie consent).

- Integrations listed: Gmail, Outlook, HubSpot, Salesforce, Pipedrive,
  Slack, Calendly.

- Public monthly prices: Growth \$149 a month (5,000 emails), Scale
  \$499 a month (25,000 emails, CRM sync, API).

- Same trial size as Explee: 750 emails, but with no card.

- Safety numbers: up to 40 emails per inbox per day, auto-pause above 2%
  bounce.

### Behind Explee

| Gap                                                 | Why it matters                                                                                                  |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| Lead data is billed separately by the data provider | Explee's lead finding is free. A buyer comparing the two sees our real price as \$149 plus an unknown data bill |
| Subscription only                                   | Explee's no-subscription entry is its main hook for founders testing outbound                                   |
| No owned data, no local-business data               | Explee reaches shops, clinics and venues through Google Maps data                                               |
| No market sizing tool                               | Segments Explorer is a free top-of-funnel tool and an SEO asset                                                 |
| No budget optimiser                                 | Explee moves spend to segments with the lowest cost per lead                                                    |
| No social proof we can show                         | Explee shows a live counter and named results; we have early access and a waitlist                              |
| Product is in early access                          | Explee is live. Every feature below must ship, not just appear on the site                                      |

### Site claims that break our own rules

The brand voice (v1.0, November 2026) bans each of these. Fix them
before launch or comparison pages:

1.  **"4.8 average rating" and "16,000+ users"**: the voice bans rating
    and user-count claims without a verifiable source. Remove them
    unless they can be sourced.

2.  **Calls as a channel, and Aircall in integrations**: the voice says
    never claim we make cold calls. Either remove both or scope it
    precisely (for example, click-to-call logging for a meeting already
    booked).

3.  **"2 months free" on yearly billing**: the voice bans discount
    language in new content. Say "\$1,490 a year" instead, or similar.

4.  **WhatsApp approvals**: not in the approved claims list (app, email,
    Slack). Remove until it ships.

5.  **Inbound Labs named as a data provider**: fine to keep, but keep
    the two brands clearly separate in copy.

## Positioning: an upgrade, not a replacement

Explee has taught the market that an agent can run outbound from one
URL. We don't argue with that. We take the same starting point and fix
what goes wrong after the first send.

**Positioning line (for comparison pages and sales calls):** Outbound
Labs runs your outbound from one website, like Explee does. The
difference is what happens before anything sends and after someone
replies: you approve every campaign, emails go out under your name in
the buyer's language, LinkedIn and website visitors join the same
sequence, and every booked meeting comes with a brief.

### Who we pick fights for

| Buyer                               | What they get from Explee    | What they get from us on top                                                |
|-------------------------------------|------------------------------|-----------------------------------------------------------------------------|
| Founder before the first sales hire | Cheap test, no setup         | Approval, own sender name, meetings booked into their calendar with a brief |
| Agency running outbound for clients | One agent, one account       | Client workspaces, per-client approval, white-label reports                 |
| B2B SaaS team                       | Email outreach               | CRM sync both ways, existing-customer exclusion, visitor ID, LinkedIn       |
| Seller in a non-English market      | English-first copy and names | Local sender identity, native-language writing and checks                   |

### Who should pick Explee instead

In line with the honesty principle, say it out loud: if you want the
lowest possible cost per email, no review step, and you only need email,
Explee is a fine choice. If you want to approve what goes out under your
name, pick us.

## Parity features to match Explee

These close the gaps. Ship them first; none is a differentiator on its
own, but missing any of them loses the comparison.

| \#  | Feature                                 | Owner agent             | What "done" means                                                                               | Size |
|-----|-----------------------------------------|-------------------------|-------------------------------------------------------------------------------------------------|------|
| P1  | One-field start, plus a no-website path | Researcher              | URL or a 3-question form gives a business profile in under 2 minutes                            | S    |
| P2  | Free lead preview before signup         | Strategist + Prospector | Show segments, fit scores and 10 sample decision makers with no card                            | M    |
| P3  | Contact data included in plans          | Prospector              | Verified contacts counted in the plan; no separate provider bill for the customer (see pricing) | M    |
| P4  | Local-business data source              | Prospector              | A licensed places dataset (for example via a maps data provider) for SMB segments               | M    |
| P5  | Market explorer                         | Strategist              | Free public tool: type a niche, see neighbouring niches and company counts by country           | M    |
| P6  | 30+ languages                           | Writer                  | Write in the lead's language; language picked per segment                                       | S    |
| P7  | Budget follows results                  | Strategist              | Segments tagged Scaling, Working or Paused by cost per meeting, with the reason shown           | M    |
| P8  | Reply handling and booking              | Closer                  | Answer questions, propose times, send invites, book into Google or Outlook calendar             | M    |
| P9  | CSV and CRM list import                 | Prospector              | Upload up to 30,000 rows with per-row outcomes                                                  | S    |
| P10 | Full public API                         | Platform                | Search, enrich, campaigns, inbox, replies, booked-meeting webhooks                              | L    |
| P11 | Native HubSpot app                      | Platform                | Booked meetings and replies land as contacts, deals and activities                              | M    |
| P12 | Regional data pages                     | Marketing               | Programmatic pages by country and industry, only where the page has real value                  | M    |

Sizes: S under 1 week, M 1 to 3 weeks, L 3+ weeks, for one experienced
engineer.

## Upgrade features beyond Explee

Each one answers a specific Explee complaint or a gap Explee doesn't
cover. Ranked by how much it moves the comparison.

### Control and trust

**U1. Approval that never times out.** Nothing sends on a timer. A
campaign waits in the approval queue until someone approves it, in the
app, by email or in Slack. Approve a whole campaign, or open it and
remove individual leads and emails. Explee complaint it answers: sends
went out after about 2 hours without approval.

**U2. Claim check on every email.** Before an email enters the queue,
the Writer checks each claim against the Researcher's profile of your
business: price, features, case studies, geography. Anything it can't
trace gets cut or flagged. The approval screen shows the source for each
personal first line. Answers: wrong offers and "AI slop".

**U3. Spend you can see before it happens.** A hard monthly cap, a
charge preview before each batch, a running total in the header and
one-click cancel in settings. Answers: double charges, charges after
free credit.

### Your brand, every market

**U4. Sender identity per market.** Choose between our warmed domains or
lookalike domains we set up for your brand. Set sender names, signatures
and reply-to per market (a Hungarian name and domain for Hungary).
Answers: rigid English sender names, no local domain.

**U5. Native-language QA.** For each non-English campaign, a second pass
reviews tone and grammar in that language, and the approval screen shows
an English gloss next to each email so you can check what it says.

### More channels, same sequence

**U6. Email + LinkedIn + visitors in one flow.** A visitor from a target
account moves that account up the queue and adds a LinkedIn touch.
LinkedIn steps can stay manual (a task for you) because LinkedIn's terms
ban automation. Explee is email only.

**U7. Signals that explain "why now".** Every lead carries one reason
it's in the campaign today: a job post, funding, a new hire in the
buying role, a site visit, a tech change. The Writer uses it for the
first line.

### After the reply

**U8. Honest reply labels.** Replies sorted into Meeting booked,
Interested, Question, Not now, Not a fit, Unsubscribe, with a confidence
score and one-click correction. The headline number in the product is
meetings booked, not "hot leads". Answers: replies mislabelled as hot.

**U9. Meeting brief.** 30 minutes before each booked call, the Closer
sends a one-page brief to your email or Slack: who they are, their
company, the thread so far, the signal that started it and 3 questions
to ask. This is the product version of our tagline: you just show up.

**U10. No-show recovery.** If the buyer misses the meeting, the Closer
offers 2 new times within 10 minutes.

### Teams and agencies

**U11. Agency workspaces.** One login, many clients: separate mailboxes,
approvals, budgets and data per client, with a white-label weekly
report.

**U12. CRM sync both ways.** Read existing customers, open deals and
do-not-contact lists from HubSpot, Salesforce or Pipedrive so we never
email them. Write meetings and replies back.

### Built for the AI era

**U13. Outbound Labs MCP server.** Run and approve campaigns from
Claude, ChatGPT and other AI tools: "Show me campaigns waiting for
approval", "Pause anything above 2% bounce". Explee has an API but no
MCP server.

**U14. Weekly outbound memo.** A short report every Monday: meetings
booked, cost per meeting, best-performing first line, segment changes
and what the agents plan to try next.

### What we deliberately won't build

- Cold calling. Our voice says we work over email and LinkedIn.

- Auto-send on timeout, ever.

- Fake urgency in emails or invented case studies in copy.

## Pricing and packaging

On price per email we're already cheaper: Growth works out to about
\$0.03 per email (\$149 for 5,000) against Explee's about \$0.04. The
problem is that our data is billed separately and Explee's lead finding
is free, so the real comparison loses. Proposal:

| Plan       | Price                                   | Emails        | Contact data                                     | Notes                                                                     |
|------------|-----------------------------------------|---------------|--------------------------------------------------|---------------------------------------------------------------------------|
| Trial      | \$0, no card                            | 750 once      | Included                                         | Same size as Explee's \$30 credit, without the card                       |
| Flex (new) | About \$0.05 per email, no subscription | Pay as you go | Included                                         | Hard monthly cap required at setup. Answers Explee's no-subscription hook |
| Growth     | \$149 a month                           | 5,000         | Included up to a set number of verified contacts | Keep the price; add data                                                  |
| Scale      | \$499 a month                           | 25,000        | Included up to a set number of verified contacts | Add agency workspaces                                                     |
| Yearly     | \$1,490 or \$4,990 a year               | As above      | As above                                         | State the yearly price, no "months free" wording                          |

**Decision needed before this goes live:** what one verified contact
costs us from our data providers, including Inbound Labs. Set the
included contact count so data stays under about 30% of plan revenue. If
that number doesn't work, keep data separate and show a calculator with
the full monthly cost instead.

**Brand voice update needed:** the voice currently says never claim lead
data is free or included. If we include it, update that rule and the
approved claims list first, then the site.

## Roadmap by phase

Assumes a small team (2 to 3 engineers). Dates are targets from 1
December 2026; adjust to real capacity.

| Phase               | Dates                     | Ships                                                                                                                                                                             | Exit test                                                                   |
|---------------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| 0\. Clean up        | 1 to 14 Dec 2026          | Fix the 5 site claims; decide pricing; event tracking for every agent step                                                                                                        | Every public claim matches the approved list                                |
| 1\. Parity core     | 15 Dec 2026 to 7 Feb 2027 | P1, P2, P3, P6, P8, P9, plus U1 (approval that never times out) and U3 (spend caps)                                                                                               | A new user goes from URL to approved first campaign in under 15 minutes     |
| 2\. Trust upgrade   | 8 Feb to 31 Mar 2027      | U2 claim check, U4 sender identity, U5 language QA, U8 reply labels, U9 meeting brief, P7 budget optimiser, P11 HubSpot app, U12 CRM sync                                         | Early-access users book meetings; reply-label precision checked on a sample |
| 3\. Reach and scale | Apr to May 2027           | U6 multichannel flow, U7 signals, U10 no-show recovery, U11 agency workspaces, P4 local data, P5 market explorer, P10 public API, U13 MCP server, U14 weekly memo, P12 data pages | Leave early access; publish the Explee comparison page                      |

Comparison page rule: publish only after phase 2, and only with facts
Explee publishes, each with a date.

## Metrics

**North star: meetings held per paying workspace per month.** Held, not
booked, and not "hot leads". This is the number Explee doesn't lead
with, and it matches our tagline.

| Area           | Metric                                             | Target to start             |
|----------------|----------------------------------------------------|-----------------------------|
| Activation     | URL entered to first campaign approved             | Under 15 minutes, median    |
| Activation     | Trial users who approve a campaign within 24 hours | Track from launch, then set |
| Control        | Emails sent without an approval record             | 0, always                   |
| Deliverability | Bounce rate per mailbox                            | Under 2% (auto-pause above) |
| Deliverability | Spam complaint rate                                | Under 0.1%                  |
| Quality        | Emails edited or removed at approval               | Falling month on month      |
| Quality        | Reply-label precision on a weekly sample           | Above 95%                   |
| Outcome        | Cost per meeting held                              | Shown to every customer     |
| Revenue        | Trial to paid conversion, monthly churn            | Track from launch, then set |

All targets are internal. None goes in marketing copy as a promised
rate.

## Risks and open decisions

| Risk                                                           | Mitigation                                                                                                             |
|----------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Data margin: including contacts could make Growth unprofitable | Set included contact counts from real provider costs; keep a fallback of separate data with a cost calculator          |
| LinkedIn account bans                                          | Daily limits, manual-step option, clear warning in the product (already in the FAQ)                                    |
| Shared-domain reputation: one bad customer hurts others        | Per-customer sending domains, auto-pause, acceptable use enforcement, review of first campaigns                        |
| GDPR and cold email law in the EU and UK                       | Legitimate-interest assessment, opt-out across campaigns, erasure requests honoured via API, data processing agreement |
| Explee adds approvals or LinkedIn                              | Our lead is control plus brand identity plus the meeting brief, not one feature. Ship phase 2 fast                     |
| Early access with a fully built-out site                       | Mark unbuilt features "coming soon" or remove them until they ship                                                     |
| Copying risk                                                   | Build from public behaviour only; no use of their wording, design, data or code                                        |

### Open decisions for Om

1.  Include contact data in plans, or keep it separate with a
    calculator?

2.  Launch Flex (pay as you go) or stay subscription-only?

3.  Keep calls and Aircall on the site in a narrow form, or drop them?

4.  Own lookalike domains per customer, or shared warmed pool by
    default?

5.  Agencies as the first paid segment, or founders?

## Sources

All read on 28 November 2026. Explee figures are self-reported by
Explee.

- [Explee homepage](https://explee.com/)

- [Explee Segments Explorer](https://explee.com/tools/explorer)

- [Explee compliance FAQ](https://explee.com/compliance-faq)

- [Explee public API docs](https://api.explee.com/)

- [Explee on the HubSpot
  marketplace](https://ecosystem.hubspot.com/th/marketplace/listing/explee)

- [TestingCatalog: Explee launches AutoGTM (May
  2026)](https://testingcatalog.com/explee-launches-autogtm-ai-agent-for-outbound-sales/)

- [Salesforge: Explee review
  (competitor-written)](https://www.salesforge.ai/blog/explee-review)

- [Boniface Ovuoba: Explee AI review
  (affiliate-written)](https://buttondown.com/flexoba/archive/explee-ai-review-real-leads-or-hype/)

- [Trustpilot: Explee
  reviews](https://pl.trustpilot.com/review/explee.com)

- [Outbound Labs website](https://outboundlabs.app/)

- Outbound Labs Brand Guide v1.0 (October 2026) and Brand Voice v1.0
  (November 2026), supplied by Om
