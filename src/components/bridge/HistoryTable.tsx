import { ExternalLink } from "lucide-react";
import { formatEther } from "viem";
import { Card } from "@/components/ui/card";
import ethLogo from "@/assets/eth-logo.png";
import wethRbLogo from "@/assets/wethrb-logo.png";
import { useBridgeHistory, type BridgeHistoryRow } from "@/hooks/useBridgeHistory";
import { redbellyTxUrl, sepoliaTxUrl, shorten } from "@/lib/bridge";

function StatusPill({ row }: { row: BridgeHistoryRow }) {
  const minted = row.status === "minted" || Boolean(row.mint);
  const approvals = row.approvals?.length ?? 0;
  const label = minted ? "Minted" : `${approvals}-of-2 approved`;
  const tone = minted ? "bg-success/12 text-success" : "bg-warning/12 text-warning";

  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}

export function HistoryTable() {
  const { rows, loading, error } = useBridgeHistory();

  return (
    <Card className="border-border p-0 shadow-none">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <h2 className="text-base font-medium text-foreground">Bridge history</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All bridge transactions, tracked live against both chains.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-muted-foreground">
          {loading ? "Loading bridge history…" : (error ?? "No bridge transfers yet.")}
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
              {rows.map((row) => (
                <tr
                  key={`${row.sourceChainId}-${row.sourceNonce}`}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <img src={ethLogo} alt="" className="size-4 object-contain" />
                      {formatEther(BigInt(row.amountWei))} ETH
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                    {shorten(row.recipient)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {row.sepoliaTxHash ? (
                      <a
                        href={sepoliaTxUrl(row.sepoliaTxHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                      >
                        {shorten(row.sepoliaTxHash)}
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusPill row={row} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {row.mint?.redbellyTxHash ? (
                      <a
                        href={redbellyTxUrl(row.mint.redbellyTxHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
                      >
                        <img src={wethRbLogo} alt="" className="size-4 object-contain" />
                        {shorten(row.mint.redbellyTxHash)}
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
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
