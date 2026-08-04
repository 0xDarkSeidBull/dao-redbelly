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

export function useBridgeHistory(pollMs = 15000) {
  const [rows, setRows] = useState<BridgeHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async () => {
    try {
      const response = await fetch(BRIDGE_HISTORY_URL);
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      const json = (await response.json()) as { results?: BridgeHistoryRow[] };
      setRows(Array.isArray(json.results) ? json.results : []);
      setError(undefined);
    } catch {
      setError("Couldn't load bridge history right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(), pollMs);
    return () => window.clearInterval(interval);
  }, [load, pollMs]);

  return { rows, loading, error, refresh: load };
}
