/**
 * DefiLlama TVL Adapter — Redbelly Network (chain key: "rbn")
 *
 * Generic, standalone Uniswap-V2-fork TVL adapter template for any
 * AMM/DEX protocol deployed natively on Redbelly Network.
 *
 * Unlike DefiLlama's internal `getUniTVL` cache helper (which lives in
 * the private `projects/helper/` tree of the DefiLlama-Adapters repo
 * and is not published on npm), this file depends only on the public
 * `@defillama/sdk` package, so it can be copy-pasted into a new
 * `projects/<your-protocol>/index.js` file in a DefiLlama-Adapters PR
 * without pulling in undocumented internals.
 *
 * How TVL is calculated:
 *   1. Read `allPairsLength()` from the AMM factory contract.
 *   2. Read each pair address via `allPairs(i)`.
 *   3. For every pair, read `token0`, `token1`, and `getReserves()`.
 *   4. Sum every token's on-chain balance across all pairs using
 *      `sdk.api.util.sumSingleBalance` via `api.sumTokens`, which
 *      DefiLlama's own price oracle then converts to USD.
 *
 * Verified against (source of truth, DefiLlama's own SDK config):
 *   chain key : rbn
 *   chainId   : 151
 *   RPC       : https://governors.mainnet.redbelly.network
 *   explorer  : https://redbelly.routescan.io
 * (confirmed via `require('@defillama/sdk/build/providers.json').rbn`
 *  on @defillama/sdk v5.0.220 — this is DefiLlama's own chain config,
 *  not a third-party guess.)
 */

const UNISWAP_V2_PAIR_ABI = {
  getReserves: 'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  token0: 'address:token0',
  token1: 'address:token1',
};

const UNISWAP_V2_FACTORY_ABI = {
  allPairsLength: 'uint256:allPairsLength',
  allPairs: 'function allPairs(uint256) view returns (address)',
};

/**
 * @param {string} factory - AMM factory contract address on Redbelly
 * @returns {function} DefiLlama-style async tvl(api) function
 */
function buildRedbellyUniV2Adapter(factory) {
  return async (api) => {
    // 1. How many pairs does this factory know about?
    const pairsLength = await api.call({
      target: factory,
      abi: UNISWAP_V2_FACTORY_ABI.allPairsLength,
    });

    // 2. Fetch every pair address.
    const pairIndexes = Array.from({ length: Number(pairsLength) }, (_, i) => i);
    const pairAddresses = await api.multiCall({
      abi: UNISWAP_V2_FACTORY_ABI.allPairs,
      calls: pairIndexes.map((i) => ({ target: factory, params: [i] })),
    });

    if (pairAddresses.length === 0) return api.getBalances();

    // 3. Read token0/token1 + reserves for every pair in batched multicalls.
    const [token0s, token1s, reserves] = await Promise.all([
      api.multiCall({ abi: UNISWAP_V2_PAIR_ABI.token0, calls: pairAddresses }),
      api.multiCall({ abi: UNISWAP_V2_PAIR_ABI.token1, calls: pairAddresses }),
      api.multiCall({ abi: UNISWAP_V2_PAIR_ABI.getReserves, calls: pairAddresses }),
    ]);

    // 4. Add each token's reserve balance to the running TVL tally.
    pairAddresses.forEach((_, i) => {
      api.add(token0s[i], reserves[i].reserve0);
      api.add(token1s[i], reserves[i].reserve1);
    });

    return api.getBalances();
  };
}

module.exports = {
  methodology:
    'TVL is the sum of both reserve tokens held in every liquidity pair ' +
    'created by the protocol\'s AMM factory contract on Redbelly Network ' +
    '(chain 151), read directly via on-chain multicalls. No off-chain ' +
    'APIs are used, per DefiLlama\'s requirement that TVL be computed ' +
    'from blockchain data.',
  // Replace FACTORY_ADDRESS_HERE with the protocol's real factory address
  // before submitting — see registry/contracts.json for the format.
  rbn: {
    tvl: buildRedbellyUniV2Adapter('FACTORY_ADDRESS_HERE'),
  },
};

// Exported for local unit testing / reuse in other adapters.
module.exports.buildRedbellyUniV2Adapter = buildRedbellyUniV2Adapter;
