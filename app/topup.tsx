import { useAppState } from "@/components/providers/app-state-provider";
import {
  useWebLN,
  Button,
  Dialog,
  DialogStatus,
  useToast,
  Input,
} from "@fedibtc/ui";
import { mutateWithBody } from "@/lib/rest";
import { CreateInvoiceResponse } from "@/lib/server/lightning/address";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function TopupDialog() {
  const { topupDialog, setTopupDialog, refetchBalance } = useAppState();
  const [amount, setAmount] = useState(0);
  const [paymentPending, setPaymentPending] = useState(false);

  const webln = useWebLN();
  const toast = useToast();

  const {
    mutate: updateBalance,
    error: bError,
    isIdle,
    reset: resetAwaitInvoiceMutation,
  } = useMutation({
    mutationFn: (invoice: string) =>
      mutateWithBody<{
        amount: number;
        invoice: string;
      }>("/invoice", { invoice }, "PUT"),
    onSuccess: async () => {
      refetchBalance();
      setPaymentPending(false);
      setTimeout(() => {
        resetAwaitInvoiceMutation();
        resetCreateTopupInvoiceMutation();
        setAmount(0);
        setTopupDialog(false);
      }, 2000);
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const {
    mutate: topup,
    isPending,
    error,
    reset: resetCreateTopupInvoiceMutation,
  } = useMutation({
    mutationFn: () =>
      mutateWithBody<CreateInvoiceResponse>("/invoice", {
        amount,
      }),
    onSuccess: async (data) => {
      setPaymentPending(true);
      await webln.sendPayment(data.pr);
      updateBalance(data.pr);
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const unifiedError = error || bError;

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
        <Button onClick={() => topup()} loading={isPending}>
          Submit
        </Button>
      </div>

      {isIdle ? null : (
        <DialogStatus
          status={
            unifiedError ? "error" : paymentPending ? "loading" : "success"
          }
          title={
            unifiedError
              ? unifiedError?.message
              : paymentPending
                ? "Loading..."
                : "Success!"
          }
          description={
            unifiedError
              ? unifiedError.message
              : paymentPending
                ? "Waiting for payment..."
                : "Topup Successful"
          }
        />
      )}
    </Dialog>
  );
}
