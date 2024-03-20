"use client";

import { useAppState } from "@/components/providers/app-state-provider";
import { formatError } from "@/lib/errors";
import { Button, Dialog, DialogStatus, Input, useWebLN } from "@fedibtc/ui";
import { useEffect, useState } from "react";
import { createLnInvoice } from "./actions/create-ln-invoice";
import { topup } from "./actions/topup";

export default function TopupDialog() {
  const { topupDialog, setTopupDialog, refetchBalance } = useAppState();
  const [amount, setAmount] = useState(0);
  const [paymentPending, setPaymentPending] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isIdle, setIsIdle] = useState(true);

  const webln = useWebLN();

  const handleTopup = async () => {
    setIsIdle(false);
    setIsLoading(true);
    setPaymentPending(true);
    try {
      const prRes = await createLnInvoice({
        amount,
      });

      if (!prRes.success) throw new Error(prRes.message);

      await webln.sendPayment(prRes.data.invoice);

      setPaymentPending(false);

      const topupRes = await topup({
        invoice: prRes.data.invoice,
      });

      if (!topupRes.success) throw new Error(topupRes.message);

      refetchBalance();

      setTimeout(() => {
        setTopupDialog(false);
      }, 3000);
    } catch (e) {
      setError(formatError(e));
    } finally {
      setPaymentPending(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setAmount(0);
    setPaymentPending(false);
    setIsLoading(false);
    setError(null);
    setIsIdle(true);
  }, [topupDialog]);

  return (
    <Dialog
      open={topupDialog}
      onOpenChange={setTopupDialog}
      title="Topup"
      description="Enter the amount you want to topup"
    >
      <div className="flex flex-col gap-md">
        <Input
          value={String(amount)}
          onChange={(e) => setAmount(Number(e.target.value))}
          type="number"
          autoFocus
        />
        <div className="flex gap-md w-full overflow-hidden min-w-0 min-h-0">
          <Button
            onClick={() => setAmount(amount < 10 ? 10 : amount + 10)}
            variant="outline"
            size="sm"
            className="grow basis-0 w-full"
          >
            10
          </Button>
          <Button
            onClick={() => setAmount(amount < 100 ? 100 : amount + 100)}
            variant="outline"
            size="sm"
            className="grow basis-0 w-full"
          >
            100
          </Button>
          <Button
            onClick={() => setAmount(amount < 1000 ? 1000 : amount + 1000)}
            variant="outline"
            size="sm"
            className="grow basis-0 w-full"
          >
            1000
          </Button>
        </div>
        <Button onClick={handleTopup} loading={isLoading}>
          Submit
        </Button>
      </div>

      {isIdle ? null : (
        <DialogStatus
          status={error ? "error" : paymentPending ? "loading" : "success"}
          title={error || (paymentPending ? "Loading..." : "Success!")}
          description={
            error ||
            (paymentPending ? "Waiting for payment..." : "Topup Successful")
          }
        />
      )}
    </Dialog>
  );
}
