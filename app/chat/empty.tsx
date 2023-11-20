import {
  ConversationWithMessages,
  useAppState,
} from "@/components/providers/app-state-provider";
import { useWebLN } from "@/components/providers/webln-provider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogStatus } from "@/components/ui/dialog/status";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { mutateWithBody, queryGet } from "@/lib/rest";
import { CreateInvoiceResponse } from "@/lib/server/lightning/invoice";
import { Conversation } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ChatInput from "./input";

export default function EmptyState() {
  const [value, setValue] = useState("");
  const [amount, setAmount] = useState(0);
  const [topupDialog, setTopupDialog] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);

  const { balance, refetchBalance, setConversation } = useAppState();

  const webln = useWebLN();

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
      await refetchBalance();
      setPaymentPending(false);
      setTimeout(() => {
        resetAwaitInvoiceMutation();
        resetCreateTopupInvoiceMutation();
        setAmount(0);
        setTopupDialog(false);
      }, 2000);
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
      await webln.sendPayment(data.payment_request);
      await updateBalance(data.payment_request);
    },
  });

  const { mutate: createConversation, isPending: createConversationLoading } =
    useMutation({
      mutationFn: (text: string) =>
        mutateWithBody<ConversationWithMessages>("/chat", {
          text,
        }),
      onSuccess: (data) => {
        setConversation(data);
      },
    });

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => queryGet<Array<Conversation>>("/chat"),
  });

  const unifiedError = error || bError;

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col grow items-center justify-center">
          <Icon
            icon="IconLoader2"
            size="xl"
            className="animate-load text-lightGrey"
          />
        </div>
      ) : (conversations?.length ?? 0) > 0 ? (
        <div className="flex flex-col gap-sm grow p-sm">
          <div className="flex gap-sm justify-between items-center border-b border-extraLightGrey pb-sm">
            <Text variant="h2" weight="bolder">
              LnGPT
            </Text>
            <div className="flex gap-sm items-center">
              <Text>{balance?.balance} sats</Text>
              <Button size="sm" onClick={() => setTopupDialog(true)}>
                Topup
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-sm grow">
            <Text weight="medium" className="text-grey">
              Jump back in
            </Text>
            <div className="grow relative">
              <div className="inset-0 absolute flex flex-col gap-sm overflow-auto">
                {conversations?.map((c, i) => (
                  <div
                    key={i}
                    className="p-sm rounded-md cursor-pointer flex gap-2 border border-extralightGrey items-center"
                    onClick={() => setConversation(c)}
                  >
                    <Icon icon="IconMessage" className="shrink-0 text-grey" />
                    <Text ellipsize>{c.title}</Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grow flex flex-col gap-sm justify-center items-center">
          <Text variant="h1" weight="bolder">
            LnGPT
          </Text>
          <Text>Chats for Sats ⚡️</Text>
          <Text>Balance: {balance?.balance} sats</Text>
          <Button onClick={() => setTopupDialog(true)}>Topup</Button>
        </div>
      )}

      {(balance?.balance ?? 0) > 0 ? (
        <ChatInput
          value={value}
          placeholder={
            conversations?.length === 0
              ? "Send a message..."
              : "Start a conversation..."
          }
          onChange={(e) => setValue(e.target.value)}
          loading={createConversationLoading}
          onSubmit={() => createConversation(value)}
        />
      ) : null}

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
                : "Successfully topped up your account"
            }
          />
        )}
      </Dialog>
    </>
  );
}
