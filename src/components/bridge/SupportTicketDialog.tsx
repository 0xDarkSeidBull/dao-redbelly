import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const SUPPORT_TICKET_URL = "https://api.redbridge.test-hub.xyz/api/support-ticket";

const TX_RE = /^0x[a-fA-F0-9]{64}$/;
const ADDR_RE = /^0x[a-fA-F0-9]{40}$/;

export type SupportTicketPrefill = {
  txHash?: string;
  walletAddress?: string;
  amount?: string;
  description?: string;
};

export function SupportTicketDialog({
  open,
  onOpenChange,
  prefill,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill: SupportTicketPrefill;
}) {
  const [txHash, setTxHash] = useState(prefill.txHash ?? "");
  const [walletAddress, setWalletAddress] = useState(prefill.walletAddress ?? "");
  const [amount, setAmount] = useState(prefill.amount ?? "");
  const [description, setDescription] = useState(prefill.description ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | undefined>();

  const submit = async () => {
    if (!TX_RE.test(txHash.trim())) {
      toast.error("Enter a valid Sepolia transaction hash.");
      return;
    }
    if (!ADDR_RE.test(walletAddress.trim())) {
      toast.error("Enter a valid wallet address.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(SUPPORT_TICKET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txHash: txHash.trim(),
          walletAddress: walletAddress.trim(),
          amount: amount.trim(),
          description: description.trim(),
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      const json = (await response.json()) as { ticketId?: string };
      if (!json.ticketId) throw new Error("missing ticket id");
      setTicketId(json.ticketId);
    } catch {
      toast.error("Couldn't submit, try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Contact Redbridge support</DialogTitle>
          <DialogDescription>
            Send us the details of your lock and we will review it manually.
          </DialogDescription>
        </DialogHeader>

        {ticketId ? (
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Your message has been sent to Redbridge support. Your ticket ID is{" "}
              <span className="font-mono font-medium text-accent">{ticketId}</span>, reference this
              if you follow up.
            </p>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-tx">Sepolia lock tx hash</Label>
              <Input
                id="ticket-tx"
                value={txHash}
                onChange={(event) => setTxHash(event.target.value)}
                placeholder="0x…"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-wallet">Wallet address</Label>
              <Input
                id="ticket-wallet"
                value={walletAddress}
                onChange={(event) => setWalletAddress(event.target.value)}
                placeholder="0x…"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-amount">Amount</Label>
              <Input
                id="ticket-amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-description">Description (optional)</Label>
              <Textarea
                id="ticket-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
              />
            </div>
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={submitting}
              onClick={() => void submit()}
            >
              {submitting ? "Sending…" : "Submit ticket"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
