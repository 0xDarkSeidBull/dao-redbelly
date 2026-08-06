# DeFiLlama API Endpoints — Redbelly Reference

Base URL: `https://api.llama.fi` for TVL/protocol routes below. Token
prices live on a **separate** DeFiLlama host, `https://coins.llama.fi`
— using `api.llama.fi` for the price route returns `404 Not Found`
(this bug shipped in v1 of this kit and was caught during live
verification; see `docs/TESTING.md`). No API key required for either host.

| Purpose | Method & Path | Example |
|---|---|---|
| Redbelly chain TVL over time | `GET /v2/historicalChainTvl/Redbelly` | `https://api.llama.fi/v2/historicalChainTvl/Redbelly` |
| Redbelly chain TVL chart data | `GET /charts/Redbelly` | `https://api.llama.fi/charts/Redbelly` |
| A specific protocol's full detail (incl. historical TVL by chain/token) | `GET /protocol/{slug}` | `https://api.llama.fi/protocol/reddex` |
| A specific protocol's current TVL only | `GET /tvl/{slug}` | `https://api.llama.fi/tvl/reddex` |
| All tracked protocols (to check for duplicates before submitting) | `GET /protocols` | `https://api.llama.fi/protocols` |
| Live token price by chain:address | `GET /prices/current/{chain}:{address}` | `https://coins.llama.fi/prices/current/rbn:0x...` |

`{slug}` is the lowercase-hyphenated protocol name as it appears in the
protocol's DeFiLlama URL (e.g. `reddex`, not `RedDex` or `reddex-dex`).
`rbn` is Redbelly's chain key for the `prices/current` endpoint — this is
DeFiLlama's own internal chain identifier, not the display name
"Redbelly".

**Rate limits / auth:** these routes are documented across multiple
independent third-party wrappers as key-free; DeFiLlama's Pro tier
(`api-docs.defillama.com`) adds authenticated endpoints for premium data
(e.g. DAT holdings) that are unrelated to basic TVL tracking and not
needed for this submission.

**Verification note:** these paths were cross-checked against three
independent open-source API client implementations that all agree on the
same routes (see `docs/TESTING.md` sourcing notes) rather than taken from
a single unverified source.
