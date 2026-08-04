import { createFileRoute } from "@tanstack/react-router";
import { BridgePanel } from "@/components/bridge/BridgePanel";
import { Explainer } from "@/components/bridge/Explainer";
import { Header, WarningBanner } from "@/components/bridge/Header";
import { HistoryTable } from "@/components/bridge/HistoryTable";
import { useBridgeTransfers } from "@/hooks/useBridgeTransfers";
import { useWallet } from "@/hooks/useWallet";
import { LOCK_VAULT_ADDRESS, WETH_RB_ADDRESS, shorten } from "@/lib/bridge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RB Bridge, Sepolia ETH to Redbelly WETH.rb" },
      {
        name: "description",
        content:
          "Lock ETH on Ethereum Sepolia and receive wrapped WETH.rb 1:1 on Redbelly Testnet through a 2-of-3 relayer bridge.",
      },
      { property: "og:title", content: "RB Bridge, Sepolia ETH to Redbelly WETH.rb" },
      {
        property: "og:description",
        content:
          "Testnet cross-chain bridge: lock ETH on Sepolia, mint WETH.rb 1:1 on Redbelly Testnet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BridgePage,
});

function BridgePage() {
  const wallet = useWallet();
  const { transfers, addTransfer, updateTransfer, clearHistory } = useBridgeTransfers();
  const activeTransfer = transfers[0];

  return (
    <div className="min-h-screen bg-background">
      <Header
        {...(wallet.address ? { address: wallet.address } : {})}
        {...(wallet.chainId !== undefined ? { chainId: wallet.chainId } : {})}
        connecting={wallet.connecting}
        onConnect={() => void wallet.connect()}
        onDisconnect={wallet.disconnect}
      />
      <WarningBanner />

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10 sm:py-14">
        {!wallet.hasProvider ? (
          <p className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-muted-foreground">
            No EVM wallet detected. Install MetaMask to connect to Sepolia and Redbelly Testnet.
          </p>
        ) : null}

        <BridgePanel
          wallet={wallet}
          {...(activeTransfer ? { activeTransfer } : {})}
          onCreate={addTransfer}
          onUpdate={updateTransfer}
        />

        <Explainer />

        <HistoryTable transfers={transfers} onClear={clearHistory} />

        <footer className="grid gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:grid-cols-2">
          <p>
            SepoliaLockVault ·{" "}
            <a
              href={`https://sepolia.etherscan.io/address/${LOCK_VAULT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent hover:underline"
            >
              {shorten(LOCK_VAULT_ADDRESS, 6)}
            </a>
          </p>
          <p className="sm:text-right">
            WETHBridged ·{" "}
            <a
              href={`https://redbelly.testnet.routescan.io/address/${WETH_RB_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent hover:underline"
            >
              {shorten(WETH_RB_ADDRESS, 6)}
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
