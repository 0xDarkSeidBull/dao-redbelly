# DeFiLlama Submission Guide — Redbelly Network Protocols

## Current status (verified at time of writing)

Redbelly is **already listed** on DeFiLlama as a chain
(`defillama.com/chain/Redbelly`), currently showing one tracked protocol:
**reddex** (Redbelly's own AMM DEX, category: Dexs), registered via
DefiLlama's shared `registries/uniswapV2.js` config rather than a
standalone adapter file. Total chain TVL was a few tens of thousands of
USD at the time of writing — small, and expected to grow as more
Redbelly-native protocols get listed individually.

**What this means for submissions:** there is no "add Redbelly to
DeFiLlama" step left to do — that's done. The actionable work is
protocol-by-protocol: each new DeFi product deployed on Redbelly (a new
DEX, lending market, vault, etc.) needs its own PR to get its TVL tracked
and attributed correctly, rather than being invisible or folded into
reddex's number.

## Step-by-step: listing a new protocol

1. **Confirm it isn't already listed.** Check
   `https://api.llama.fi/protocols` (search for the protocol name) or the
   Redbelly chain page directly — avoids a duplicate/rejected PR.
2. **Fork** `https://github.com/DefiLlama/DefiLlama-Adapters`.
3. **Add a new folder**: `projects/<protocol-slug>/index.js`, using
   `<protocol-slug>` as the exact name you want to appear on DeFiLlama.
4. **Write the adapter.** For any Uniswap-V2-style AMM, this kit's
   `adapter/index.js` is a ready-to-adapt template — replace
   `FACTORY_ADDRESS_HERE` with the real factory address and set the
   `methodology` string to describe the specific protocol. For
   non-AMM protocols (lending, staking, vaults), the shape is the same
   (`module.exports = { <chain>: { tvl: async (api) => {...} } }`) but the
   on-chain calls will differ — see DefiLlama's own guide:
   `https://docs.llama.fi/list-your-project/how-to-write-an-sdk-adapter`.
5. **Test it** — see `docs/TESTING.md` Level 2. This must be run from
   infra with real RPC access; DefiLlama's own `node test.js
   projects/<slug>/index.js` is the exact command their reviewers expect
   you to have already run.
6. **Open the PR** against `DefiLlama/DefiLlama-Adapters` `main` branch.
   - Enable "Allow edits by maintainers" (DefiLlama explicitly asks for
     this so their team can fix small issues without a back-and-forth).
   - Fill in their PR template
     (`https://github.com/DefiLlama/DefiLlama-Adapters/blob/main/pull_request_template.md`).
   - Do not edit `package-lock.json` / `pnpm-lock.yaml` as part of the
     diff — DefiLlama flags this as a common CI-breaking mistake.
7. **Wait for review.** DefiLlama states PRs are monitored regularly and
   there's no need to ping their Discord to get attention — doing so is
   explicitly discouraged in their own README.
8. **After merge**, allow up to ~24 hours for the listing to appear on
   the DeFiLlama frontend (backend merge and frontend cache refresh are
   separate steps).

## Updating an already-listed protocol's metadata

Adapter code changes go through the PR flow above. But **name, logo, and
description** changes are a separate process — DeFiLlama's own repo says
these live in `defillama-server`
(`defi/src/protocols/data2.ts`) or, per their current README, should be
sent to `metadata@defillama.com`. Don't try to fix a logo/description via
a `DefiLlama-Adapters` PR — it will be out of scope for that repo.

## Ongoing maintenance (30-day actionability requirement)

- **No manual refresh needed for correct adapters.** Once merged,
  DeFiLlama's own infrastructure re-runs the adapter on a schedule and
  recomputes TVL — the Redbelly team doesn't need to re-submit data.
- **What does need attention:** if a protocol upgrades its factory
  contract, deploys a new version (V2, V3), or adds a new chain
  deployment, that's a **new PR**, same process as above — DeFiLlama
  explicitly supports "new product/version under a parent listing."
- **Recommended internal owner:** whoever maintains each protocol's
  contracts should be responsible for opening the follow-up PR when they
  redeploy — this is the same discipline already used for keeping
  `registry/contracts.json` in this kit in sync with what's actually
  deployed.
- **Realistic 30-day plan:** for one already-built, tested protocol
  adapter, PR submission is same-day work; DeFiLlama review turnaround in
  their own docs is not fixed, but community PRs of this size have
  historically been reviewed within that window based on their public
  "monitored regularly" commitment. Track the PR link once opened as your
  proof-of-progress within the 30-day window.
