"use client";

import {
  ConversationWithMessages,
  useAppState,
} from "@/components/providers/app-state-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/hooks/use-toast";
import Icon from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { mutateWithBody, queryGet } from "@/lib/rest";
import { Conversation } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ChatInput from "./input";

export default function EmptyState() {
  const [value, setValue] = useState("");

  const { balance, refetchBalance, setConversation, setTopupDialog } =
    useAppState();

  const { toast } = useToast();

  const { mutate: createConversation, isPending: createConversationLoading } =
    useMutation({
      mutationFn: (text: string) =>
        mutateWithBody<ConversationWithMessages>("/chat", {
          text,
        }),
      onSuccess: (data) => {
        setConversation(data);
      },
      onError: (err) => {
        toast({
          content: err.message,
        });
      },
    });

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => queryGet<Array<Conversation>>("/chat"),
    retry: false,
  });

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createConversation(value);
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
          loading={createConversationLoading}
        />
      </form>
    </>
  );
}
