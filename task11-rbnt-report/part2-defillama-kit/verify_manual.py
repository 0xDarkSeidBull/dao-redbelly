"""
Real on-chain 5%-margin verification for the reddex TVL adapter.
No dependencies beyond the Python standard library — run as-is.

What it does:
  1. Calls reddex's factory contract on Redbelly (chain 151) via
     Routescan's free Etherscan-compatible proxy API to read every
     liquidity pair, its two tokens, and their reserves.
  2. Prices each token in USD via DefiLlama's free price API.
  3. Prints a manually-computed TVL total.

Run it, then paste the full output back — that number gets compared
against DefiLlama's own live reddex TVL to prove (or catch) a >5% gap.
"""
import json
import urllib.request

FACTORY = "0x262E06314Af8f4EEd70dbd8C7EFe2a5De686C142"  # reddex factory on Redbelly
CHAIN_ID = 151
ROUTESCAN_BASE = f"https://api.routescan.io/v2/network/mainnet/evm/{CHAIN_ID}/etherscan/api"

SEL_ALL_PAIRS_LENGTH = "0x574f2ba3"
SEL_ALL_PAIRS = "0x1e3dd18b"   # + uint256 index, padded to 32 bytes
SEL_TOKEN0 = "0x0dfe1681"
SEL_TOKEN1 = "0xd21220a7"
SEL_GET_RESERVES = "0x0902f1ac"
SEL_DECIMALS = "0x313ce567"


def eth_call(to, data):
    url = f"{ROUTESCAN_BASE}?module=proxy&action=eth_call&to={to}&data={data}&tag=latest"
    with urllib.request.urlopen(url, timeout=15) as r:
        result = json.load(r)
    if "result" not in result:
        raise RuntimeError(f"eth_call failed for {to} {data}: {result}")
    return result["result"]


def decode_uint(hexstr):
    return int(hexstr, 16)


def decode_address(hexstr):
    return "0x" + hexstr[-40:]


def main():
    length = decode_uint(eth_call(FACTORY, SEL_ALL_PAIRS_LENGTH))
    print(f"reddex factory reports {length} pairs on Redbelly (chain 151)\n")

    token_balances = {}  # token_address -> raw integer balance summed across pairs
    token_decimals = {}

    for i in range(length):
        idx_hex = format(i, "064x")
        pair_raw = eth_call(FACTORY, SEL_ALL_PAIRS + idx_hex)
        pair = decode_address(pair_raw)

        t0 = decode_address(eth_call(pair, SEL_TOKEN0))
        t1 = decode_address(eth_call(pair, SEL_TOKEN1))
        reserves_raw = eth_call(pair, SEL_GET_RESERVES)
        # getReserves() returns (uint112, uint112, uint32) packed as 3x32-byte words
        reserves_raw = reserves_raw[2:]  # strip 0x
        reserve0 = int(reserves_raw[0:64], 16)
        reserve1 = int(reserves_raw[64:128], 16)

        print(f"pair {i}: {pair}")
        print(f"  token0={t0} reserve0_raw={reserve0}")
        print(f"  token1={t1} reserve1_raw={reserve1}")

        token_balances[t0] = token_balances.get(t0, 0) + reserve0
        token_balances[t1] = token_balances.get(t1, 0) + reserve1

    print("\nFetching decimals for each token...")
    for tok in token_balances:
        try:
            token_decimals[tok] = decode_uint(eth_call(tok, SEL_DECIMALS))
        except Exception as e:
            print(f"  WARNING: could not read decimals for {tok} ({e}), assuming 18")
            token_decimals[tok] = 18

    coins_param = ",".join(f"rbn:{tok}" for tok in token_balances)
    price_url = f"https://coins.llama.fi/prices/current/{coins_param}"
    print(f"\nFetching prices: {price_url}")
    with urllib.request.urlopen(price_url, timeout=15) as r:
        prices = json.load(r).get("coins", {})

    print("\n--- Manual TVL breakdown ---")
    total_usd = 0.0
    for tok, raw_balance in token_balances.items():
        dec = token_decimals[tok]
        amount = raw_balance / (10 ** dec)
        key = f"rbn:{tok}"
        price_info = prices.get(key)
        price = price_info["price"] if price_info else None
        if price is None:
            print(f"{tok}: {amount:.6f} tokens — NO PRICE DATA (excluded from total)")
            continue
        usd_value = amount * price
        total_usd += usd_value
        print(f"{tok}: {amount:.6f} tokens x ${price:.6f} = ${usd_value:,.2f}")

    print(f"\n=== MANUALLY COMPUTED reddex TVL (Redbelly chain only): ${total_usd:,.2f} ===")
    print("Compare this to the live figure at https://defillama.com/protocol/reddex")


if __name__ == "__main__":
    main()
