import { queryGet } from "@/lib/rest";
import { Balance, Conversation, Message } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, createContext, use, useState } from "react";

export type ConversationWithMessages = Conversation & {
  messages: Array<Message>;
};

interface AppState {
  balance?: Balance | null;
  conversation?: ConversationWithMessages | null;
  setConversation: Dispatch<SetStateAction<ConversationWithMessages | null>>;
  refetchBalance: () => void;
}

export const AppStateContext = createContext<AppState | null>(null);

export const useAppState = () => {
  const ctx = use(AppStateContext);

  if (!ctx) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return ctx;
};

export const AppStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { refetch: refetchBalance, data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: () => queryGet<Balance>("/balance"),
  });

  const [conversation, setConversation] =
    useState<ConversationWithMessages | null>(null);

  return (
    <AppStateContext.Provider
      value={{
        balance,
        refetchBalance,
        conversation,
        setConversation,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
