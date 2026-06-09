# WaiverFlow

**State-accurate lien waivers for subcontractors — without Procore.**

Generate the four statutory California lien waivers (and growing) in 60 seconds, right in your
browser. Built for the long tail of subcontractors who run on QuickBooks and Excel and can't
justify a $400–1250/month construction platform just to send a waiver every month.

## Why this exists

Lien waiver compliance is a monthly, recurring chore for every subcontractor getting paid on a
project. The incumbents (Siteline, GCPay, Flashtract, Levelset) are priced for GCs and large subs.
WaiverFlow is the **low-end** option: dead simple, cheap, QuickBooks-friendly.

## Status — Cycle 6 MVP (first slice)

✅ Select state → select waiver type → fill the blanks → generate & download a verbatim statutory PDF.
Everything runs client-side; nothing is uploaded.

**Coverage today**
- California — CC §8132 / §8134 / §8136 / §8138 (conditional/unconditional × progress/final)
- Texas — Property Code §53.284(b) (conditional progress)

**Not yet built**: electronic signing, status tracking, multi-user accounts, billing, QuickBooks
export, additional states.

## ⚠️ Legal posture (hard guardrails)

WaiverFlow renders a **document format only**. It does **not** provide legal advice, verify your
rights, auto-detect the "right" form, or guarantee compliance — the user selects the state and
waiver type and is responsible for confirming it against current statute. Templates are reproduced
verbatim and labeled with their statutory source. **DRAFT — templates pending construction-attorney
review (CA + TX + FL) before public launch.**

## Stack

Vite + React 19 + TypeScript. PDF generation via `pdf-lib` (lazy-loaded, off the initial bundle).
Backend (signing, tracking, accounts) intentionally deferred to Cloudflare Workers + D1 + R2.

## Develop

```bash
npm install
npm run dev          # local dev server
npm run build        # typecheck + production build
npx tsx scripts/verify.ts   # generate a sample PDF and validate the core chain
```

## Architecture

- `src/waivers/types.ts` — data-driven waiver model (states, types, declarative render blocks)
- `src/waivers/templates.ts` — the statutory template library (the core asset)
- `src/waivers/generatePdf.ts` — declarative `Block[]` → letter-size PDF renderer
- `src/App.tsx` — three-step flow: state → type → form → download

Adding a state or waiver type means appending declarative data to `TEMPLATES` — no renderer changes.
