# Redbelly Network — RWA.xyz Submission Kit

Part 3 of TASK-11 (RBNT Token Utility and Ecosystem Visibility Report).

## Status check (verified, not assumed)

The task brief claims Redbelly is "absent from major RWA tracking
platforms (RWA.xyz, DeFiLlama)". That claim was checked against both
platforms independently in this task:

- **DeFiLlama: the brief was outdated.** Redbelly's chain and its DEX
  (reddex) are already listed — see Part 2 of this task.
- **RWA.xyz: the brief is accurate.** Redbelly does **not** appear in
  RWA.xyz's Directory (`app.rwa.xyz/directory`), nor in either tier of
  its indexed-network coverage list (`docs.rwa.xyz/methodology/coverage`
  — Full: Ethereum, Solana, Avalanche, ZKsync Era, Aptos, XRP Ledger,
  XDC, Mantra; Limited: Polygon, Arbitrum, Optimism, Base, Mantle, NEAR,
  Sui, Algorand, Stellar, Gnosis, Provenance, Noble, BSC, Tron, Blast,
  Celo, Manta Pacific, Canto). Redbelly is in neither list.

  Note: a *different* site, `rwa.io` (not `rwa.xyz`), does have a
  Redbelly Network profile with live RBNT price/market-cap data. That is
  a separate company/product from RWA.xyz and does not satisfy this
  task's "RWA.xyz" deliverable — flagging this explicitly so it isn't
  mistaken for the same listing.

## Why this kit looks different from the DeFiLlama one (Part 2)

DeFiLlama listing is a self-service GitHub PR — code you write, submit,
and a bot verifies. **RWA.xyz onboarding is not self-service.** Per
their own documentation (`docs.rwa.xyz/onboarding/networks`), it is a
relationship-driven process: sign up in their Partners App, get a
dedicated Slack channel, do a kickoff call, then work through data
collection and integration with their team over several steps. There is
no code to write and no PR to open — this matches the task's own
description of this deliverable as documentation/format work, not code.

This kit cannot complete that process on your behalf (it requires an
account, a Slack channel, and live conversations with RWA.xyz's team),
but it prepares every piece of information their process asks for, in
the exact order they ask for it, so the actual onboarding is just
copy-paste and scheduling — not research.

## What's in this kit

| File | Purpose |
|---|---|
| `docs/ONBOARDING-CHECKLIST.md` | The real 7-step RWA.xyz network onboarding process (sourced from their docs), condensed into an actionable checklist |
| `docs/NETWORK-PROFILE-DRAFT.md` | Pre-filled answers for the "Add New Company" / Network Information form (Step 1) |
| `docs/PLATFORMS-TO-INTRODUCE.md` | Known Redbelly-ecosystem tokenization platforms/issuers to introduce during Step 3 (Data Collection), each with what's independently confirmed about it |
| `docs/POC-TEMPLATE.md` | The 3 points-of-contact roles RWA.xyz requires before the kickoff call, as a fill-in template |

## Sources

- `docs.rwa.xyz/onboarding/networks` — onboarding process
- `docs.rwa.xyz/methodology/coverage` — indexed-network coverage list
- `app.rwa.xyz/directory`, `app.rwa.xyz/networks` — current Directory/Networks listings
- Public press releases and Redbelly's own blog/X account — platform partnership facts (each cited in `PLATFORMS-TO-INTRODUCE.md`)
