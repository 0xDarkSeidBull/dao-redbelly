# RWA.xyz Network Onboarding — Checklist

Source: `docs.rwa.xyz/onboarding/networks` (fetched and verified as part
of this task — this is RWA.xyz's own published process, not a guess).

## Step 1 — Pre-Kickoff

- [ ] Sign up for the RWA.xyz **Partners App**
- [ ] Click **"Claim Company"** and search "Redbelly" in the dropdown —
      confirmed absent as of this task (see `README.md`), so this will
      come back empty
- [ ] Click **"Add New Company"** instead
- [ ] Enter network name exactly as it should appear publicly:
      **Redbelly Network**
- [ ] Under **"Step 4: Listing Type"** in their form, select **"Network"**
      (not Platform/Issuer/Service Provider)
- [ ] Fill every field to the best of current knowledge — RWA.xyz's own
      docs note more-complete profiles get more user engagement.
      Use `NETWORK-PROFILE-DRAFT.md` in this kit for the answers.
- [ ] Add any final notes for their review team, click **"Submit New Listing"**
- [ ] Expect a response in **1–2 business days** (approval or follow-up questions)

## Step 2 — Kickoff

- [ ] RWA.xyz sets up a dedicated **Slack channel** between the two orgs
- [ ] Before the kickoff call, designate 3 points of contact — use
      `POC-TEMPLATE.md` in this kit:
  - Overall project management
  - Technical questions
  - Marketing
- [ ] Review the **Network Scope Spreadsheet** RWA.xyz provides (status
      tracker) — this comes from their side, nothing to prepare in advance
      beyond having the POCs ready
- [ ] On the call: confirm timeline, walk through tokenization platforms/
      assets deployed on Redbelly (see `PLATFORMS-TO-INTRODUCE.md`),
      flag any Redbelly-specific implementation quirks (e.g. DBFT
      consensus, chain ID 151 vs testnet 153), optionally set up
      recurring weekly syncs

## Step 3 — Data Collection

RWA.xyz needs introductions to every tokenization platform issuing
assets on Redbelly. For each one, per their process:

- [ ] Platform creates a profile in the Partners App (Platform Reference Data)
- [ ] Issuer(s) create profiles too — or the platform submits on their behalf,
      which RWA.xyz says is usually more efficient
- [ ] Platform adds detailed per-asset info (Asset Reference Data)
- [ ] Work out an ongoing pricing/valuation feed per asset

Start with the platforms in `PLATFORMS-TO-INTRODUCE.md` — that file has
what's independently confirmed about each so the intro isn't a cold
question mark.

## Step 4 — Data Integration (on-chain)

- [ ] RWA.xyz ingests **raw logs and traces** directly (they explicitly do
      not use indexers) — someone with node/infra access will need to be
      involved, not just a dashboard export
- [ ] Preferred delivery format: a **Databricks Delta-Share** or **Parquet
      files in cloud storage** — not a live RPC pull on their end
- [ ] If any custom protocols are deployed on Redbelly, their teams assist
      RWA.xyz directly to keep the data accurate

## Step 5 — Marketing Plan

- [ ] Coordinate with RWA.xyz's marketing team once data collection/
      integration is finalized — press release, X/LinkedIn posts (short
      announcement + a longer ecosystem-data post), optional co-hosted
      X Spaces

## Step 6 — Data Review

- [ ] RWA.xyz sends a preview of how Redbelly will appear on the platform
- [ ] Review and send back feedback before go-live

## Step 7 — Go-Live

- [ ] Data goes live on an agreed date, marketing rolls out alongside it

## After launch

- **Adding a new platform later:** add it + POCs to the Network Scope
  Document, introduce them to RWA.xyz — same Data Collection flow as Step 3.
- **Editing network info:** log into the Partners App → find the network →
  "Edit" → submit a "Change Request" (reviewed within 1 business day).
- **Reporting a data error:** message the shared Slack channel with the
  page URL, a screenshot, and the corrected value.
