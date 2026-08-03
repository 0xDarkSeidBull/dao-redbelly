import { ExternalLink } from "lucide-react";
import { formatEther } from "viem";
import { Card } from "@/components/ui/card";
import type { Transfer } from "@/hooks/useBridgeTransfers";
import { redbellyTxUrl, sepoliaTxUrl, shorten } from "@/lib/bridge";

function StatusPill({ transfer }: { transfer: Transfer }) {
  const label =
    transfer.status === "minted"
      ? "Minted"
      : transfer.status === "failed"
        ? "Failed"
        : transfer.status === "locking"
          ? "Locking"
          : `${transfer.approvals}-of-2 approved`;

  const tone =
    transfer.status === "minted"
      ? "bg-secondary text-success"
      : transfer.status === "failed"
        ? "bg-accent-soft text-accent"
        : "bg-secondary text-muted-foreground";

  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}

export function HistoryTable({
  transfers,
  onClear,
}: {
  transfers: Transfer[];
  onClear: () => void;
}) {
  return (
    <Card className="border-border p-0 shadow-none">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <h2 className="text-base font-medium text-foreground">Bridge history</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Locks initiated from this browser, tracked live against both chains.
          </p>
        </div>
        {transfers.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Clear
          </button>
        ) : null}
      </div>

      {transfers.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-muted-foreground">
          No bridge transfers yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Recipient</th>
                <th className="px-6 py-3 font-medium">Sepolia lock</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Redbelly mint</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="border-b border-border last:border-b-0">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                    {formatEther(BigInt(transfer.amountWei))} ETH
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                    {shorten(transfer.recipient)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {transfer.sepoliaTx ? (
                      <a
                        href={sepoliaTxUrl(transfer.sepoliaTx)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                      >
                        {shorten(transfer.sepoliaTx)}
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusPill transfer={transfer} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {transfer.mintTx ? (
                      <a
                        href={redbellyTxUrl(transfer.mintTx)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                      >
                        {shorten(transfer.mintTx)}
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
