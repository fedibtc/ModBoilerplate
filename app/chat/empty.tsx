"use client";

import { useAppState } from "@/components/providers/app-state-provider";
import { queryGet } from "@/lib/rest";
import { Button, Icon, Text, useFediInjection, useToast } from "@fedibtc/ui";
import { Conversation } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { depositEcash } from "../actions/topup-ecash";
import { redeemLighting } from "../actions/withdraw";
import { createChat } from "./actions/create";
import ChatInput from "./input";

export default function EmptyState() {
  const [value, setValue] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const { balance, refetchBalance, setConversation } = useAppState();

  const toast = useToast();
  const { webln, fedi } = useFediInjection();

  const handleCreateConversation = async (text: string) => {
    setIsCreatingConversation(true);

    const res = await createChat({ text });

    if (!res.success) {
      throw new Error(res.message);
    }

    setConversation(res.data);
    setIsCreatingConversation(false);
  };

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => queryGet<Array<Conversation>>("/chat"),
    retry: false,
  });

  const handleTopup = async () => {
    setDepositLoading(true);
    try {
      let ecashNotes: string | undefined;

      try {
        ecashNotes = await fedi.generateEcash?.({
          minimumAmount: 1,
        });
      } catch {
        /* no-op */
      }

      if (!ecashNotes) return;

      const res = await depositEcash({
        notes: ecashNotes,
      });

      if (!res.success) {
        // Reclaim the ecash so the notes aren't lost
        await fedi.receiveEcash?.(ecashNotes);
        throw new Error(res.message);
      }

      toast.show({
        content: `Successfully deposited ${res.amount} sats`,
        status: "success",
      });

      refetchBalance();
    } catch (e) {
      toast.error(e);
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!balance?.balance) return;

    setWithdrawLoading(true);

    try {
      let paymentRequest: string | undefined;

      try {
        const invoice = await webln.makeInvoice({
          minimumAmount: 1,
          maximumAmount: balance?.balance,
        });

        paymentRequest = invoice.paymentRequest;
      } catch {
        /* no-op */
      }

      if (!paymentRequest) return;

      const res = await redeemLighting({
        invoice: paymentRequest,
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.show({
        content: `Successfully withdrew ${res.amount} sats`,
        status: "success",
      });

      refetchBalance();
    } catch (e) {
      toast.error(e);
    } finally {
      setWithdrawLoading(false);
    }
  };

  useEffect(() => {
    refetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <Text>{balance?.balance} sats</Text>
            <div className="flex gap-sm items-center">
              <Button size="sm" onClick={handleTopup} loading={depositLoading}>
                Topup
              </Button>
              <Button
                size="sm"
                onClick={handleWithdraw}
                loading={withdrawLoading}
                disabled={!balance?.balance}
              >
                Withdraw
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
            AI Assistant
          </Text>
          <Text>Chats for Sats ⚡️</Text>
          <Text>Balance: {balance?.balance} sats</Text>
          <Button onClick={handleTopup} loading={depositLoading}>
            Topup
          </Button>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateConversation(value);
        }}
      >
        <ChatInput
          value={value}
          placeholder={
            conversations?.length === 0
              ? "Send a message..."
              : "Start a conversation..."
          }
          onChange={(e) => setValue(e.target.value)}
          loading={isCreatingConversation}
        />
      </form>
    </>
  );
}
