# KYC and Wallet Activation Explainer

Five recurring points of confusion, answered in plain language. Every claim is sourced or marked unconfirmed.

## 1. When KYC is required

**KYC is required for native RBNT and mainnet activity. It is not required to hold or trade wrapped RBNT on other chains.**

Redbelly Network gates access to its own Layer 1 (mainnet transactions, staking, governance) behind identity verification through the Redbelly Access portal. Wrapped RBNT on Ethereum or other chains is a standard ERC-20 token with no Redbelly-side identity check, so buying, holding, or swapping it on an external DEX does not require Redbelly KYC.

*Source: Redbelly Individual Onboarding SDK overview, docs.redbelly.network. Wrapped-token distinction inferred from wrapped RBNT operating as a standard ERC-20 outside Redbelly's identity layer.*

## 2. The ten-wallet-per-identity limit

**One verified identity can activate up to 10 wallets. Beyond that limit, additional wallets cannot be linked to the same KYC record.**

The limit applies per person, not per wallet, so completing KYC once covers up to 10 separate wallet addresses under that identity. A wallet requesting activation beyond the tenth is not accepted against an already-maxed identity.

*Source: verified firsthand by the contributor, who registered 10 wallets under one identity, and confirmed by a Redbelly moderator in the Discord support channel.* **[MOD-VERIFIED, DISCORD — NO PUBLISHED DOC]**

## 3. Typical approval wait time

**Most KYC submissions are approved in about 3 to 5 minutes.**

This is the typical turnaround reported for a standard individual submission through the Redbelly Access portal. Submissions that need manual review, such as flagged documents or edge-case jurisdictions, can take longer than this range.

*Source: verified firsthand by the contributor and confirmed by a Redbelly moderator in the Discord support channel.* **[MOD-VERIFIED, DISCORD — NO PUBLISHED DOC]**

## 4. Regional restrictions

**Eighteen jurisdictions are currently restricted from accessing the Redbelly Network platform. This list has not been confirmed as reduced from a prior version.**

Redbelly's own Terms and Conditions state the platform is not offered to residents or tax residents of: Afghanistan, Central African Republic, North Korea, Democratic Republic of the Congo, Guinea-Bissau, Iran, Iraq, Lebanon, Libya, Myanmar, Russia, Somalia, South Sudan, Sudan, Syria, Ukraine, Yemen, and Zimbabwe. Anyone outside this list can proceed with KYC and mainnet access; anyone inside it cannot, regardless of wallet or exchange used.

*Source: Redbelly Network Terms and Conditions, Clause 15, redbelly.network/terms-and-conditions. Note: this document reflects currently restricted jurisdictions. No official record of a prior, larger restricted list was found, so the claim that restrictions have been reduced is not confirmed and is not repeated here as fact.*

## 5. KYC as a prerequisite for staking

**Staking RBNT requires completed KYC, because staking is a mainnet action gated by the same identity layer as any other native transaction.**

Redbelly's whitepaper lists staking as one of RBNT's core token uses, alongside gas, governance, sharding, and incentives, all of which run on Redbelly's own chain rather than a wrapped external token. Since mainnet access itself requires identity verification, a wallet cannot stake without first completing KYC.

*Source: Redbelly Network whitepaper, redbelly.network/whitepaper. KYC-gating inferred from the same mainnet-access requirement covered in Section 1.*

---

Two claims above (ten-wallet limit, approval wait time) are verified firsthand by the contributor and confirmed by a Redbelly moderator in Discord, but have no published official document. They are marked accordingly per task requirements. All other claims are cited to an official Redbelly source.
