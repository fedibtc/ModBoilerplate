import {
  ConversationWithMessages,
  useAppState,
} from "@/components/providers/app-state-provider";
import { Text } from "@/components/ui/text";
import { queryGet } from "@/lib/rest";
import { useQuery } from "@tanstack/react-query";
import { Message as AIMessage } from "ai";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import Header from "../header";
import ChatInput from "../input";
import LoadingState from "./loading-state";
import Message from "./message";
import { Message as PrismaMessage } from "@prisma/client";

function ConversationChat({ convo }: { convo: ConversationWithMessages }) {
  const { refetchBalance } = useAppState();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: convo.messages.map((x: PrismaMessage) => ({
        id: String(x.id),
        content: x.content,
        role: x.role === "SYSTEM" ? "system" : "user",
      })) as Array<AIMessage>,
      body: {
        conversationId: convo.id,
      },
      onFinish: () => {
        refetchBalance();
      },
    });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col grow divide-y divide-extraLightGrey">
      <div className="grow relative">
        <div className="absolute inset-0 flex flex-col gap-md overflow-auto px-md py-sm">
          {messages.map((m, i) => (
            <Message message={m} key={i} />
          ))}
          {isLoading && (
            <Message
              message={{
                content: "...",
                role: "system",
              }}
              loading
            />
          )}
          <div ref={scrollRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <ChatInput
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
        />
      </form>
    </div>
  );
}

export default function Conversation() {
  const { conversation, refetchBalance } = useAppState();

  const {
    data: convo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["loadConversation", conversation],
    queryFn: () =>
      queryGet<ConversationWithMessages>(
        "/api/conversations?id=" + conversation!.id
      ),
    retry: false,
  });

  useEffect(() => {
    refetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col divide-y divide-extraLightGrey grow">
      <Header />
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <div className="grow flex flex-col justify-center items-center">
          <Text variant="h2" weight="bolder">
            An Error Occurred
          </Text>
          <Text>{error.message}</Text>
        </div>
      ) : (
        <ConversationChat convo={convo!} />
      )}
    </div>
  );
}
