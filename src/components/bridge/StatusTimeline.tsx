import { CheckCircle2, Circle, Loader2, ExternalLink } from "lucide-react";
import type { Transfer } from "@/hooks/useBridgeTransfers";
import { redbellyTxUrl, sepoliaTxUrl, shorten } from "@/lib/bridge";

type StepState = "done" | "active" | "todo";

function icon(state: StepState) {
  if (state === "done") return <CheckCircle2 className="size-5 text-success" />;
  if (state === "active") return <Loader2 className="size-5 animate-spin text-accent" />;
  return <Circle className="size-5 text-muted-foreground/50" />;
}

export function StatusTimeline({ transfer }: { transfer: Transfer }) {
  const lockDone = Boolean(transfer.sepoliaTx) && transfer.status !== "locking";
  const approvals = transfer.approvals;
  const minted = transfer.executed;

  const steps: { title: string; detail: string; state: StepState }[] = [
    {
      title: "Locking on Sepolia",
      detail: transfer.sepoliaTx
        ? "ETH locked in the SepoliaLockVault contract."
        : "Waiting for your wallet signature and confirmation.",
      state: lockDone ? "done" : "active",
    },
    {
      title: "Waiting for relayer confirmations",
      detail: `2-of-3 signers required — ${approvals} of 2 approvals recorded on Redbelly.`,
      state: minted ? "done" : lockDone ? "active" : "todo",
    },
    {
      title: "WETH.rb minted on Redbelly Testnet",
      detail: minted
        ? "Your wrapped ETH has been minted 1:1."
        : "The relayer executes the mint once 2 approvals land.",
      state: minted ? "done" : "todo",
    },
  ];

  return (
    <div className="space-y-5 rounded-lg border border-border bg-secondary/60 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Transfer status</p>
        {transfer.nonce !== undefined ? (
          <span className="text-xs text-muted-foreground">Lock nonce #{transfer.nonce}</span>
        ) : null}
      </div>

      <ol className="space-y-4">
        {steps.map((step) => (
          <li key={step.title} className="flex gap-3">
            <span className="mt-0.5">{icon(step.state)}</span>
            <div>
              <p
                className={`text-sm font-medium ${
                  step.state === "todo" ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {step.title}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-sm">
        {transfer.sepoliaTx ? (
          <a
            href={sepoliaTxUrl(transfer.sepoliaTx)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
          >
            Sepolia lock tx {shorten(transfer.sepoliaTx)}
            <ExternalLink className="size-3.5" />
          </a>
        ) : null}
        {transfer.mintTx ? (
          <a
            href={redbellyTxUrl(transfer.mintTx)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
          >
            Redbelly mint tx {shorten(transfer.mintTx)}
            <ExternalLink className="size-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
