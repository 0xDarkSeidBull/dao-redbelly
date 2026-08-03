import { useCallback, useEffect, useMemo, useState } from "react";
import { decodeEventLog, formatEther, parseEther, type Address } from "viem";
import { toast } from "sonner";
import { ArrowDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusTimeline } from "@/components/bridge/StatusTimeline";
import type { Transfer } from "@/hooks/useBridgeTransfers";
import { useWallet } from "@/hooks/useWallet";
import {
  LOCK_VAULT_ADDRESS,
  REDBELLY_CHAIN_ID,
  SEPOLIA_CHAIN_ID,
  WETH_RB_ADDRESS,
  isAddressLike,
  lockVaultAbi,
  redbellyClient,
  sepoliaChain,
  sepoliaClient,
  wethBridgedAbi,
} from "@/lib/bridge";

type Wallet = ReturnType<typeof useWallet>;

export function BridgePanel({
  wallet,
  activeTransfer,
  onCreate,
  onUpdate,
}: {
  wallet: Wallet;
  activeTransfer?: Transfer;
  onCreate: (transfer: Transfer) => void;
  onUpdate: (id: string, patch: Partial<Transfer>) => void;
}) {
  const { address, chainId, isConnected, connect, connecting, switchChain, getWalletClient } =
    wallet;

  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientTouched, setRecipientTouched] = useState(false);
  const [limits, setLimits] = useState<{ min: bigint; max: bigint } | undefined>();
  const [ethBalance, setEthBalance] = useState<bigint | undefined>();
  const [wethBalance, setWethBalance] = useState<bigint | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (address && !recipientTouched) setRecipient(address);
  }, [address, recipientTouched]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const [min, max] = await Promise.all([
          sepoliaClient.readContract({
            address: LOCK_VAULT_ADDRESS,
            abi: lockVaultAbi,
            functionName: "MIN_LOCK_AMOUNT",
          }),
          sepoliaClient.readContract({
            address: LOCK_VAULT_ADDRESS,
            abi: lockVaultAbi,
            functionName: "MAX_LOCK_AMOUNT",
          }),
        ]);
        if (!cancelled) setLimits({ min, max });
      } catch {
        if (!cancelled) toast.error("Couldn't read bridge limits from the Sepolia contract.");
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadBalances = useCallback(async () => {
    if (!address) return;
    setRefreshing(true);
    try {
      const [eth, weth] = await Promise.all([
        sepoliaClient.getBalance({ address }),
        redbellyClient.readContract({
          address: WETH_RB_ADDRESS,
          abi: wethBridgedAbi,
          functionName: "balanceOf",
          args: [address],
        }),
      ]);
      setEthBalance(eth);
      setWethBalance(weth);
    } catch {
      /* transient RPC failure */
    } finally {
      setRefreshing(false);
    }
  }, [address]);

  useEffect(() => {
    void loadBalances();
  }, [loadBalances, activeTransfer?.status]);

  const amountWei = useMemo(() => {
    if (!amount.trim()) return undefined;
    try {
      return parseEther(amount.trim());
    } catch {
      return undefined;
    }
  }, [amount]);

  const amountError = useMemo(() => {
    if (!amount.trim()) return undefined;
    if (amountWei === undefined) return "Enter a valid ETH amount.";
    if (limits) {
      if (amountWei < limits.min) return `Minimum is ${formatEther(limits.min)} ETH.`;
      if (amountWei > limits.max) return `Maximum is ${formatEther(limits.max)} ETH.`;
    }
    return undefined;
  }, [amount, amountWei, limits]);

  const recipientError =
    recipient.trim() && !isAddressLike(recipient) ? "Enter a valid EVM address (0x + 40 hex)." : undefined;

  const canSubmit =
    isConnected &&
    !submitting &&
    amountWei !== undefined &&
    !amountError &&
    isAddressLike(recipient);

  const onSepolia = chainId === SEPOLIA_CHAIN_ID;

  const handleLock = async () => {
    if (!address || amountWei === undefined) return;
    setSubmitting(true);
    const id = `${Date.now()}`;
    try {
      if (!onSepolia) {
        toast.info("Switching your wallet to Ethereum Sepolia…");
        await switchChain(SEPOLIA_CHAIN_ID);
      }

      const walletClient = getWalletClient();
      const hash = await walletClient.writeContract({
        account: address,
        chain: sepoliaChain,
        address: LOCK_VAULT_ADDRESS,
        abi: lockVaultAbi,
        functionName: "lock",
        args: [recipient.trim() as Address],
        value: amountWei,
      });

      onCreate({
        id,
        sender: address,
        recipient: recipient.trim(),
        amountWei: amountWei.toString(),
        sepoliaTx: hash,
        approvals: 0,
        executed: false,
        status: "locking",
        createdAt: Date.now(),
      });
      toast.success("Lock transaction submitted on Sepolia.");

      const receipt = await sepoliaClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") {
        onUpdate(id, { status: "failed" });
        toast.error("Lock transaction reverted on Sepolia.");
        return;
      }

      let nonce: string | undefined;
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== LOCK_VAULT_ADDRESS.toLowerCase()) continue;
        try {
          const decoded = decodeEventLog({
            abi: lockVaultAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "Locked") {
            nonce = (decoded.args as { nonce: bigint }).nonce.toString();
          }
        } catch {
          /* not our event */
        }
      }

      onUpdate(id, { status: "locked", ...(nonce ? { nonce } : {}) });
      toast.success("Locked! Waiting for relayer confirmations (2-of-3 signers required).");
      void loadBalances();
      setAmount("");
    } catch (error) {
      const message = (error as { shortMessage?: string; message?: string }).shortMessage ??
        (error as Error).message ??
        "Transaction failed.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-border p-0 shadow-[var(--shadow-card)]">
      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium text-foreground">Bridge ETH to Redbelly</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Lock ETH on Ethereum Sepolia and receive WETH.rb 1:1 on Redbelly Testnet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadBalances()}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Sepolia ETH</p>
            <p className="mt-1 text-lg font-medium text-foreground">
              {ethBalance !== undefined ? `${Number(formatEther(ethBalance)).toFixed(5)} ETH` : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Redbelly WETH.rb
            </p>
            <p className="mt-1 text-lg font-medium text-foreground">
              {wethBalance !== undefined
                ? `${Number(formatEther(wethBalance)).toFixed(5)} WETH.rb`
                : "—"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="amount">Amount to bridge</Label>
            <span className="text-xs text-muted-foreground">
              {limits
                ? `Limits ${formatEther(limits.min)} – ${formatEther(limits.max)} ETH`
                : "Loading limits…"}
            </span>
          </div>
          <div className="relative">
            <Input
              id="amount"
              inputMode="decimal"
              placeholder="0.0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="h-12 border-input bg-background pr-16 text-base placeholder:text-muted-foreground focus-visible:border-accent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              ETH
            </span>
          </div>
          {amountError ? <p className="text-sm text-accent">{amountError}</p> : null}
        </div>

        <div className="flex justify-center">
          <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card">
            <ArrowDown className="size-4 text-muted-foreground" />
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient on Redbelly Testnet</Label>
          <Input
            id="recipient"
            placeholder="0x…"
            value={recipient}
            onChange={(event) => {
              setRecipientTouched(true);
              setRecipient(event.target.value);
            }}
            className="h-12 font-mono text-sm"
          />
          {recipientError ? (
            <p className="text-sm text-accent">{recipientError}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Defaults to your connected wallet. Edit it to mint WETH.rb to another address.
            </p>
          )}
        </div>

        {!isConnected ? (
          <Button
            onClick={() => void connect()}
            disabled={connecting}
            className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
          >
            {connecting ? "Connecting…" : "Connect wallet"}
          </Button>
        ) : !onSepolia ? (
          <Button
            onClick={() => void switchChain(SEPOLIA_CHAIN_ID)}
            className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
          >
            Switch network to Ethereum Sepolia
          </Button>
        ) : (
          <Button
            onClick={() => void handleLock()}
            disabled={!canSubmit}
            className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
          >
            {submitting ? "Confirm in your wallet…" : "Lock & Bridge"}
          </Button>
        )}

        {isConnected && chainId !== REDBELLY_CHAIN_ID ? (
          <button
            type="button"
            onClick={() => void switchChain(REDBELLY_CHAIN_ID)}
            className="w-full text-center text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Add / switch to Redbelly Testnet in your wallet
          </button>
        ) : null}

        {activeTransfer ? <StatusTimeline transfer={activeTransfer} /> : null}
      </div>
    </Card>
  );
}
