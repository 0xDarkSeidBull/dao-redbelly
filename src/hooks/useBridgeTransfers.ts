import { useCallback, useEffect, useRef, useState } from "react";
import {
  REDBELLY_CHAIN_ID,
  SEPOLIA_CHAIN_ID,
  WETH_RB_ADDRESS,
  redbellyClient,
  wethBridgedAbi,
} from "@/lib/bridge";

export type TransferStatus =
  | "locking"
  | "locked"
  | "detected"
  | "approved-1"
  | "minted"
  | "failed";

export type Transfer = {
  id: string;
  sender: string;
  recipient: string;
  amountWei: string;
  sepoliaTx?: string;
  nonce?: string;
  approvals: number;
  executed: boolean;
  mintTx?: string;
  status: TransferStatus;
  createdAt: number;
};

const STORAGE_KEY = "rb-bridge-transfers";

function load(): Transfer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Transfer[]) : [];
  } catch {
    return [];
  }
}

function save(items: Transfer[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function useBridgeTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const transfersRef = useRef<Transfer[]>([]);

  useEffect(() => {
    const initial = load();
    transfersRef.current = initial;
    setTransfers(initial);
  }, []);

  const commit = useCallback((next: Transfer[]) => {
    transfersRef.current = next;
    setTransfers(next);
    save(next);
  }, []);

  const addTransfer = useCallback(
    (transfer: Transfer) => {
      commit([transfer, ...transfersRef.current]);
    },
    [commit],
  );

  const updateTransfer = useCallback(
    (id: string, patch: Partial<Transfer>) => {
      commit(transfersRef.current.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    [commit],
  );

  const clearHistory = useCallback(() => commit([]), [commit]);

  /** Poll the WETHBridged contract for relayer approvals + execution. */
  const poll = useCallback(async () => {
    const pending = transfersRef.current.filter(
      (t) => t.nonce !== undefined && !t.executed && t.status !== "failed",
    );
    if (pending.length === 0) return;

    for (const transfer of pending) {
      try {
        const mintKey = await redbellyClient.readContract({
          address: WETH_RB_ADDRESS,
          abi: wethBridgedAbi,
          functionName: "computeMintKey",
          args: [BigInt(SEPOLIA_CHAIN_ID), BigInt(transfer.nonce!)],
        });

        const [, , approvalCount, executed] = await redbellyClient.readContract({
          address: WETH_RB_ADDRESS,
          abi: wethBridgedAbi,
          functionName: "mintRequests",
          args: [mintKey],
        });

        const approvals = Number(approvalCount);
        let mintTx: string | undefined = transfer.mintTx;

        if (executed && !mintTx) {
          try {
            const latest = await redbellyClient.getBlockNumber();
            const fromBlock = latest > 50000n ? latest - 50000n : 0n;
            const logs = await redbellyClient.getLogs({
              address: WETH_RB_ADDRESS,
              event: wethBridgedAbi.find(
                (item) => item.type === "event" && item.name === "MintExecuted",
              ) as never,
              args: { mintKey } as never,
              fromBlock,
              toBlock: "latest",
            });
            mintTx = (logs as Array<{ transactionHash?: string }>)[0]?.transactionHash;
          } catch {
            /* explorer/RPC may not support wide log ranges */
          }
        }

        const status: TransferStatus = executed
          ? "minted"
          : approvals >= 1
            ? "approved-1"
            : approvals === 0 && Number(transfer.nonce) >= 0
              ? "detected"
              : transfer.status;

        if (
          approvals !== transfer.approvals ||
          executed !== transfer.executed ||
          mintTx !== transfer.mintTx ||
          status !== transfer.status
        ) {
          updateTransfer(transfer.id, {
            approvals,
            executed,
            ...(mintTx ? { mintTx } : {}),
            status,
          });
        }
      } catch {
        /* transient RPC failure — retry on the next tick */
      }
    }
  }, [updateTransfer]);

  useEffect(() => {
    void poll();
    const interval = window.setInterval(() => void poll(), 12000);
    return () => window.clearInterval(interval);
  }, [poll, transfers.length]);

  return {
    transfers,
    addTransfer,
    updateTransfer,
    clearHistory,
    refresh: poll,
    redbellyChainId: REDBELLY_CHAIN_ID,
  };
}
