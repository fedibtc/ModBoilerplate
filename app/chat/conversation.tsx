import { useAppState } from "@/components/providers/app-state-provider";
import { useToast } from "@/components/ui/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Message } from "ai";
import { useChat } from "ai/react";
import { useState } from "react";
import Header from "./header";
import ChatInput from "./input";
import Messages from "./messages";

function Input() {
  const [value, setValue] = useState("");

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(0);
        }, 1000);
      });
    },
    onError: (error) => {
      toast({
        content: error.message,
      });
    },
  });

  return (
    <ChatInput
      value={value}
      setValue={setValue}
      loading={isPending}
      onSubmit={() => mutate()}
    />
  );
}

export default function Conversation() {
  const { conversation } = useAppState();

  const initialMessages: Array<Message> = (conversation?.messages ?? []).map(
    (x, id) => ({
      content: x.content,
      role: x.role === "SYSTEM" ? "assistant" : "user",
      id: String(id),
    }),
  );

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages,
  });

  return (
    <>
      <Header />
      <Messages />
      <Input />
    </>
  );
}
