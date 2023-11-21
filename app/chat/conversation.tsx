import {
  ConversationWithMessages,
  useAppState,
} from "@/components/providers/app-state-provider";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { queryGet } from "@/lib/rest";
import { useQuery } from "@tanstack/react-query";
import { Message as AIMessage } from "ai";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import Header from "./header";
import ChatInput from "./input";

function Message({
  message,
  loading = false,
}: {
  message: AIMessage;
  loading?: boolean;
}) {
  const isSystem = message.role !== "user";

  return (
    <div
      className={`flex ${
        isSystem ? "flex-row" : "flex-row-reverse"
      } items-end gap-sm`}
    >
      {isSystem && (
        <Avatar id="1" name="system" size="sm" className="shrink-0" />
      )}
      <div className="flex flex-col gap-xs">
        <div className="flex">
          {isSystem && (
            <Text variant="caption" className={loading ? "transparent" : ""}>
              system
            </Text>
          )}
        </div>
        <div
          className={`p-2 rounded-xl ${
            isSystem ? "bg-green/10 rounded-bl-md" : "bg-blue/10 rounded-br-md"
          } ${loading ? "animate-pulse" : ""}`}
        >
          <Text
            variant="body"
            className={loading ? `${loading ? "text-transparent" : ""}` : ""}
          >
            {message.content}
          </Text>
        </div>
      </div>
    </div>
  );
}

function ConversationChat({ convo }: { convo: ConversationWithMessages }) {
  const { refetchBalance } = useAppState();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: convo.messages.map((x) => ({
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
                id: "1",
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
        "/api/conversations?id=" + conversation!.id,
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
        <div className="grow relative">
          <div className="absolute inset-0 flex flex-col gap-md overflow-auto px-md py-sm">
            <Message
              message={{
                id: "1",
                content: "Lorem Ipsum",
                role: "user",
              }}
              loading
            />
            <Message
              message={{
                id: "2",
                content:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
                role: "system",
              }}
              loading
            />
            <Message
              message={{
                id: "3",
                content: "Lorem ipsum dolor sit amet, consectetur",
                role: "user",
              }}
              loading
            />
            <Message
              message={{
                id: "4",
                content: "Sed ut perspiciatis unde omnis iste natus error",
                role: "system",
              }}
              loading
            />
            <Message
              message={{
                id: "5",
                content: "Consectetur adipiscing elit",
                role: "user",
              }}
              loading
            />
            <Message
              message={{
                id: "4",
                content: "Quis autem vel eum",
                role: "system",
              }}
              loading
            />
          </div>
        </div>
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
