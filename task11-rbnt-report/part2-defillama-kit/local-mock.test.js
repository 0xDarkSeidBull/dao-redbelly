/**
 * Offline logic test for adapter/index.js — mocks the DefiLlama `api`
 * object so the adapter's call-graph, batching, and balance-summing
 * logic can be verified WITHOUT live RPC access (this sandbox has no
 * network route to governors.mainnet.redbelly.network).
 *
 * This does NOT replace on-chain verification — see docs/TESTING.md
 * for the real `node test.js` run that must happen on infra with
 * outbound access to the Redbelly RPC (e.g. the Contabo/Hetzner VPS).
 */
const { buildRedbellyUniV2Adapter } = require('./index.js');

const FAKE_FACTORY = '0x0000000000000000000000000000000000dEaD';
const FAKE_PAIRS = ['0xPair1', '0xPair2'];
const FAKE_TOKENS = {
  '0xPair1': { token0: '0xTokenA', token1: '0xTokenB', reserve0: 1000n, reserve1: 2000n },
  '0xPair2': { token0: '0xTokenA', token1: '0xTokenC', reserve0: 500n, reserve1: 300n },
};

const balances = {};

const mockApi = {
  call: async ({ target, abi }) => {
    if (target === FAKE_FACTORY && abi.includes('allPairsLength')) return FAKE_PAIRS.length;
    throw new Error('unexpected call: ' + abi);
  },
  multiCall: async ({ abi, calls }) => {
    if (abi.includes('allPairs(uint256)')) {
      return calls.map(({ params: [i] }) => FAKE_PAIRS[i]);
    }
    if (abi === 'address:token0') return calls.map((p) => FAKE_TOKENS[p].token0);
    if (abi === 'address:token1') return calls.map((p) => FAKE_TOKENS[p].token1);
    if (abi.includes('getReserves')) {
      return calls.map((p) => ({ reserve0: FAKE_TOKENS[p].reserve0, reserve1: FAKE_TOKENS[p].reserve1 }));
    }
    throw new Error('unexpected multicall abi: ' + abi);
  },
  add: (token, amount) => {
    balances[token] = (balances[token] || 0n) + BigInt(amount);
  },
  getBalances: async () => balances,
};

(async () => {
  const adapter = buildRedbellyUniV2Adapter(FAKE_FACTORY);
  const result = await adapter(mockApi);

  const expected = { '0xTokenA': 1500n, '0xTokenB': 2000n, '0xTokenC': 300n };
  let ok = true;
  for (const [token, amount] of Object.entries(expected)) {
    if (result[token] !== amount) {
      ok = false;
      console.error(`MISMATCH ${token}: expected ${amount}, got ${result[token]}`);
    }
  }
  if (ok) {
    console.log('PASS — adapter correctly aggregates reserves across pairs (mocked, no live RPC):');
    console.log(result);
  } else {
    process.exitCode = 1;
  }
})();
