# Unstick Your RBNT

## A Cross Chain Recovery Playbook

Community support guide for wrong network sends, stuck bridges, and thin liquidity swaps. Reflects live, independently verified data as of August 2026.

## Part 1. Before You Bridge

Before you bridge anything: do not send RBNT directly to a centralized exchange deposit address unless the exchange explicitly supports the network you are sending on.

RBNT currently trades on four active exchanges: Gate, MEXC, WhiteBIT, and BYDFi.

Sending native RBNT or wrapped RBNT to the wrong network is the hardest of these four failure modes to reverse, and recovery odds are not the same across exchanges.

* Gate and MEXC both have a self service recovery form for wrong network deposits. Neither guarantees success, and MEXC charges a processing fee regardless of outcome.
* BYDFi handles this through support rather than a self service form, using your transaction hash and account ID. No fee is stated in their own documentation, but recovery is still not guaranteed.
* WhiteBIT has the weakest documented process of the four. Their own help center states a wrong network deposit may result in irreversible loss, and there is no dedicated recovery form, only a general support ticket.

### Correct deposit procedure

1. Confirm the exchange lists RBNT as a supported deposit asset before sending anything.
2. Confirm which network the exchange expects the deposit on.
3. Send a small test amount first if the exchange and network combination is new to you.
4. Keep the transaction hash, the deposit address used, and a timestamp for every deposit you make.

If you have already sent funds to the wrong address or the wrong network, skip to Part 6. Do not resend funds to fix the mistake, and do not click any claim link sent to you in Discord or a direct message claiming to help recover the funds.

## Part 2. Reference Tables

### Wrapped RBNT contract addresses

Verified against Redbelly's own announcements.

| Chain | Contract Address | Confidence |
|---|---|---|
| Ethereum | 0xb45ffb51984d626ee758b336c61cf20990c6bf13 | High, dedicated official announcement |
| Solana | 2GBVt2ENvbHepuJMWYTPkkfpWUabAhsaXToYw8UphxS3 | High, dedicated official announcement |
| Redbelly Network (native chain) | 0x6ed1F491e2d31536D6561f6bdB2AdC8F092a6076 | High, confirmed directly |
| Base | 0x020940df9F5E77338a094D55b5B5914122a804A5 | Medium, listed on Redbelly's own docs |
| BNB Chain | No official token exists | Confirmed absent, impersonator tokens found |

### Current swap liquidity by chain

Checked live, August 2026.

**Ethereum**: roughly $33,000 in WRBNT paired against WETH. 100,000 WRBNT shows 1.5% to 2.9% price impact. 1,000,000 WRBNT shows 13% to 14% price impact.

**Solana**: 10,000 WRBNT shows 86.77% price impact on Raydium. Effectively unusable for meaningful swaps right now.

**Base**: 1,000,000 RBNT shows 7.9% to 8.0% price impact across two aggregators. 100,000 RBNT shows 13.4% on a separate widget. Base currently shows lower price impact than Ethereum at matched sizes, even though it has no dedicated official liquidity announcement from Redbelly.

## Part 3. Failure Mode 1: Wrapped RBNT Zero Value or Swap Fail

If your wrapped RBNT shows zero value or a swap keeps failing, check in order: a wrong or unverified contract address, thin pool liquidity at your swap size, or a route sent to a chain your token was never issued on.

**Step 1.** Confirm the contract address against the verified table above, not by name or logo.

**Step 2.** Check pool depth before you swap. A large price impact warning is usually the pool telling you the truth, not a bug.

**Step 3.** If it still will not go through after confirming the address and reducing size, check for ordinary issues: insufficient gas, an expired quote, or slippage tolerance set too tight.

## Part 4. Failure Mode 2: Quote Unavailable Bridging RBNT Back to Redbelly Network

Redbelly's own developer docs name Lucid Labs Bridge as the official route for bringing RBNT from another chain back to Redbelly Network.

Lucid Labs Bridge supports nine source chains: Ethereum, Arbitrum, Optimism, Base, Solana, BSC, Polygon, Avalanche, and Sonic.

| Source Chain | Asset | Route | Fee | Time |
|---|---|---|---|---|
| Ethereum | RBNT | Stargate | 0.00016 ETH | About 109 min |
| Ethereum | WRBNT | Polymer | 0.000015 ETH plus 10 WRBNT | About 2 min |
| Base | RBNT | Stargate | 0.00016 ETH | About 1 min |
| Base | WRBNT | Polymer | 0.000015 ETH plus 10 WRBNT | About 10 sec |
| BSC | RBNT | Stargate | 0.0005 BNB | About 124 min |
| Arbitrum | RBNT | Stargate | 0.00017 ETH | About 172 min |
| Polygon | RBNT | Stargate | 4.43 POL | About 190 min |
| Avalanche | RBNT | Stargate | 0.05 AVAX | About 62 min |
| Sonic | RBNT | Stargate | 14.21 S | About 93 min |
| Solana | RBNT | No route found | N/A | N/A |

If you hold RBNT on Solana, this bridge currently cannot route the transfer. This is the one confirmed quote unavailable case, and it will not resolve by retrying, changing wallets, or adjusting the amount.

## Part 5. Failure Mode 3: Stablecoins Stranded on Ethereum Mainnet

If USDC or USDT sent from Ethereum toward Redbelly Network has not arrived, use reddex, Redbelly's own official interface for this route.

| Asset | Route | Fee |
|---|---|---|
| USDT | Lucid Labs (Polymer) | 1% |
| USDC | Lucid Labs (Polymer) | 1% |
| WRBNT | Lucid Labs (Polymer) | 1% |

**Step 1.** Confirm your source transaction succeeded on Etherscan.

**Step 2.** Give it time. Polymer transfers normally complete in 10 seconds to a few minutes. Anything beyond 30 minutes is a genuine delay worth investigating.

**Step 3.** Check reddex directly for your transfer status.

**Step 4.** If still stuck, collect your evidence (transaction hash, amount, timestamp, destination address) and contact Redbelly or reddex support directly. Do not resend the transfer, and do not click recovery links sent in Discord or a direct message.

## Part 6. Failure Mode 4: Native RBNT Sent to a CEX Deposit Address by Mistake

Recovery is possible on some exchanges but never guaranteed, across the four exchanges currently listing RBNT: Gate, MEXC, BYDFi, and WhiteBIT.

Collect this evidence before contacting any exchange: transaction hash, deposit address, exact asset and network, amount and timestamp, and your account identifier.

* **Gate**: self service Deposit Not Received, Recovery Request tool.
* **MEXC**: dedicated Wrong Deposit Return Application. A processing fee applies. Funds are returned to your original sending address, not credited to your MEXC balance.
* **BYDFi**: no self service form, contact Customer Support directly with your transaction ID and UID.
* **WhiteBIT**: weakest documented process of the four, general support ticket only, no dedicated recovery tool.

None of these exchanges guarantee recovery. Do not send additional funds to the same address, and do not click any link claiming to expedite recovery for a fee or your wallet credentials.

---

This guide reflects live, independently verified data as of August 2026. Liquidity, fees, and routing conditions change frequently, always confirm current quotes before acting on amounts that matter to you.
