# Outbound Labs brand guide

> Source: `docs/originals/brand-guide-v1.0.pdf` (Version 1.0, October 2026, Rathod Group of Companies Private Limited), transcribed to Markdown on 2026-11-27. The PDF has the visual examples; this file has the rules and values.

Logos, colour, type, voice and ready-made images for Outbound Labs. Use these exactly as shown so every touchpoint, from the website to a cold email signature, looks like the same company.

## 1. Logo

The eclipse mark and the wordmark. The mark is a ring lit from two sides: orange from the lower left, blue from the upper right, a black core. It is the eclipse on the homepage, reduced to a symbol. The wordmark is Inter Semibold, lower case, tracked −3%. Together they form the primary lockup.

Variants: primary on dark, primary on light, mark (PNG and SVG), mono light, mono dark, single colour white (for coloured or photo backgrounds), single colour black (for print, fax and stamps).

## 2. Clear space and size

- Clear space on every side equals the height of the mark's black core (x). Nothing else (text, edges, other logos) enters that area.
- Minimum width: lockup 120 px on screen, 30 mm in print. Below that, use the mark alone.
- Mark alone: 16 px minimum. Use it for favicons, avatars and app icons.
- Name in text: write "Outbound Labs", two words, title case. Only the logo is lower case.

## 3. Misuse

Never:

- stretch or squash the logo
- recolour the wordmark
- use light logos on light grounds
- rotate it
- retype it in another font
- add glows, shadows or outlines

## 4. Colour

Most of every surface is black. Orange and blue only appear where light would: on edges, buttons, the mark and data. Mint is reserved for success states in the product.

| Token  | Hex       | RGB         | Use                                  |
|--------|-----------|-------------|--------------------------------------|
| Black  | `#000000` | 0 0 0       | Page ground                          |
| Ink    | `#F5F5F7` | 245 245 247 | Headlines and body on black          |
| Soft   | `#A3A3AD` | 163 163 173 | Supporting text                      |
| Dim    | `#8B8B96` | 139 139 150 | Labels, captions                     |
| Orange | `#FF7A1A` | 255 122 26  | Primary accent, left edge            |
| Amber  | `#FF9A3C` | 255 154 60  | Accent text on black                 |
| Blue   | `#3D8BFF` | 61 139 255  | Secondary accent, right edge         |
| Sky    | `#8CC2FF` | 140 194 255 | Links, blue text on black            |
| Mint   | `#57E6A8` |             | Product success states only (running, verified, booked). Never in marketing |

Edge gradient:

```css
linear-gradient(90deg, #FF7A1A 0%, #FFCF9A 46%, #BFE0FF 54%, #3D8BFF 100%)
```

Use it only on thin things: button borders, a badge, a hairline under a heading. Never as a large fill.

Proportion on a typical page: Black 80%, Ink 12%, Orange about 5%, Blue about 3%.

## 5. Typography

Inter for everything people read, JetBrains Mono for what agents do. Headlines use a light weight (450) with tight tracking. Mono appears only where we show the agents working: logs, commands, counts.

- Inter: weights 300, 450, 500, 600 (Google Fonts).
- JetBrains Mono: weights 400, 500 (Google Fonts).

| Style   | Size / weight / tracking   | Example                                              |
|---------|----------------------------|------------------------------------------------------|
| Display | 64–80 / 450 / −3.5%        | We book your sales meetings.                         |
| H2      | 40 / 450 / −3%             | Six agents, one job each                             |
| H3      | 19 / 500 / −1.5%           | You approve every campaign                           |
| Lead    | 19 / 400 / Soft colour     | Paste your website. AI agents find your buyers, write the emails, send them and fill your calendar. |
| Body    | 16 / 400 / line height 1.6 | Nothing sends until you approve it.                  |
| Label   | 12 / caps / +12%           | EARLY ACCESS                                         |

Agent log example (JetBrains Mono):

```
$ run prospector --campaign spreadsheets
querying data providers via API
✓ 1,840 companies · 3,912 decision makers
  dana.ruiz@kestrelsupply.com · valid
→ 3,104 verified, 808 dropped
```

## 6. Voice (summary)

Full rules are in [brand-voice.md](brand-voice.md). Talk like the founder who just booked the meeting: plain, specific and short. Promise outcomes we control (meetings, approvals, safety) and show the work instead of hyping it.

- We are plain, specific, calm and honest. Sample data is labelled. We never invent numbers.
- We avoid hype words, buyer-unfriendly jargon, exclamation marks and emoji in product copy, and promised reply or meeting rates.

Lines we use:

- Headline: We book your sales meetings. You just show up.
- One-liner: AI agents that find your buyers, write the emails and fill your calendar.
- Offer: 750 free emails. No card. Nothing sends until you approve.

## 7. Imagery

The eclipse horizon is the one recurring image: a black planet edge with light rising behind it, orange on the left, blue on the right. It stands for the moment just before a meeting lands. Use it as a backdrop for headlines, never under body text. No stock photos of handshakes or headsets.

## 8. Interface

- The primary button carries the edge gradient as a 1.5 px border with an orange glow on the left and blue on the right. One primary button per view; everything else is ghost.
- Example elements: "Get my meetings →" (primary), "Watch a preview run" (ghost), a "New" badge ("750 free emails. No card."), status pills "running" and "needs approval".
- Corners: 10 px on buttons, 16–20 px on cards, full round on pills.
- Lines: hairlines in white at 8–14% opacity. No heavy borders.
- Motion: ease out, 300 ms. Elements rise 8 px into place. Respect reduced motion.

## 9. Files

Every file is hosted at `outboundlabs.app/brand/` and kept in the website repository under `public/brand`.

| File                          | Use                         | Size        |
|-------------------------------|-----------------------------|-------------|
| logo-white.png                | Primary logo on dark        | 4754 × 908  |
| logo-black.png                | Primary logo on light       | 4754 × 908  |
| logo-on-black.png             | Logo with black background  | 5426 × 1333 |
| logo-on-white.png             | Logo with white background  | 5426 × 1333 |
| logo-mono-white.png           | Single colour, white        | 4754 × 908  |
| logo-mono-black.png           | Single colour, black        | 4754 × 908  |
| mark.svg                      | Mark, vector                | SVG         |
| mark-1024.png                 | Mark, colour                | 1024 × 1024 |
| mark-mono-white.png / black   | Mark, single colour         | 1024 × 1024 |
| social-avatar-800.png         | LinkedIn, X, Slack avatars  | 800 × 800   |
| linkedin-banner-1584x396.png  | LinkedIn company page       | 1584 × 396  |
| x-header-1500x500.png         | X profile header            | 1500 × 500  |
| og-1200x630.png               | Link previews               | 1200 × 630  |
| presentation-1920x1080.png    | Deck and video covers       | 1920 × 1080 |
| email-signature.png           | Email signatures            | 450 × 111   |

Questions about the brand: info@inboundlabs.app
