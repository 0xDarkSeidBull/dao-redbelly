import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REDBELLY_CHAIN_ID, SEPOLIA_CHAIN_ID, shorten } from "@/lib/bridge";

const chainLabel = (chainId?: number) => {
  if (chainId === SEPOLIA_CHAIN_ID) return "Ethereum Sepolia";
  if (chainId === REDBELLY_CHAIN_ID) return "Redbelly Testnet";
  if (chainId === undefined) return "Unknown network";
  return `Chain ${chainId}`;
};

export function Header({
  address,
  chainId,
  connecting,
  onConnect,
  onDisconnect,
}: {
  address?: string;
  chainId?: number;
  connecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-accent text-sm font-medium text-accent-foreground">
            RB
          </span>
          <div>
            <p className="text-base font-medium leading-tight text-foreground">RB Bridge</p>
            <p className="text-xs text-muted-foreground">Sepolia ETH → Redbelly WETH.rb</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {address ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-foreground">{shorten(address, 4)}</p>
                <p className="text-xs text-muted-foreground">{chainLabel(chainId)}</p>
              </div>
              <Button variant="outline" onClick={onDisconnect}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              onClick={onConnect}
              disabled={connecting}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {connecting ? "Connecting…" : "Connect wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function WarningBanner() {
  return (
    <div className="border-b border-border bg-secondary">
      <div className="mx-auto flex max-w-5xl items-start gap-3 px-6 py-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">This is a testnet demo.</span> Do not send
          real funds. ETH locked on Sepolia is only recoverable by the contract owner via emergency
          withdrawal — there is no user-initiated unlock.
        </p>
      </div>
    </div>
  );
}
