import { useCallback, useEffect, useState } from "react";

export type BridgeApproval = {
  signerAddress: string;
  approvalCount: number;
  redbellyTxHash: string;
  approvedAt: number;
};

export type BridgeHistoryRow = {
  sourceChainId: number;
  sourceNonce: number;
  sender: string;
  recipient: string;
  amountWei: string;
  sepoliaTxHash: string;
  sepoliaBlockNumber: number;
  lockedAt: number;
  status: "pending" | "minted";
  approvals: BridgeApproval[];
  mint: { redbellyTxHash: string; mintedAt: number } | null;
};

export const BRIDGE_HISTORY_URL = "https://api.redbridge.test-hub.xyz/api/bridge-history";

export function useBridgeHistory(pollMs = 15000, limit?: number, offset = 0) {
  const [rows, setRows] = useState<BridgeHistoryRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async () => {
    try {
      const url = new URL(BRIDGE_HISTORY_URL);
      if (limit !== undefined) {
        url.searchParams.set("limit", String(limit));
        url.searchParams.set("offset", String(offset));
      }
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      const json = (await response.json()) as { results?: BridgeHistoryRow[]; total?: number };
      const results = Array.isArray(json.results) ? json.results : [];
      setRows(results);
      setTotal(typeof json.total === "number" ? json.total : results.length);
      setError(undefined);
    } catch {
      setError("Couldn't load bridge history right now.");
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(), pollMs);
    return () => window.clearInterval(interval);
  }, [load, pollMs]);

  return { rows, total, loading, error, refresh: load };
}

