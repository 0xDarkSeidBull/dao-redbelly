import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    title: "Lock on Sepolia",
    body: "You send ETH to the SepoliaLockVault contract. The contract emits a Locked event carrying a unique nonce, your amount and your Redbelly recipient address.",
  },
  {
    title: "Relayer watches the lock event",
    body: "An independent off-chain relayer process observes the Locked event on Ethereum Sepolia. This app does not mint anything itself — it only reads on-chain state.",
  },
  {
    title: "2 of 3 signers approve on Redbelly",
    body: "Three independent relayer-signers can approve the mint request on Redbelly Testnet. Once two approvals are recorded, the request becomes executable.",
  },
  {
    title: "WETH.rb is minted 1:1",
    body: "The WETHBridged contract mints Bridged Wrapped Ether (WETH.rb) 1:1 to your recipient address on Redbelly Testnet.",
  },
];

export function Explainer() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-border shadow-none">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-base font-medium text-foreground">How this bridge works</span>
        <ChevronDown
          className={`size-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="space-y-6 px-6 pb-6">
          <ol className="space-y-5">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-medium text-foreground">
                  {index + 1}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="rounded-md border border-border bg-secondary px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            This is a testnet demo bridge secured by a 2-of-3 multisig relayer. It is not a
            trustless or production-grade bridge: the relayer signers can censor or delay mints,
            and locked ETH is only recoverable by the contract owner.
          </p>
        </div>
      ) : null}
    </Card>
  );
}
