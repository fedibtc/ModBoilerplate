"use client";

import { queryGet } from "@/lib/rest";
import { Balance, Conversation, Message } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, createContext, use, useState } from "react";

export type ConversationWithMessages = Conversation & {
  messages: Array<Message>;
};

interface AppState {
  balance?: Balance | null;
  conversation?: Conversation | null;
  setConversation: Dispatch<SetStateAction<Conversation | null>>;
  refetchBalance: () => void;
  topupDialog: boolean;
  setTopupDialog: Dispatch<SetStateAction<boolean>>;
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
    retry: false,
    staleTime: 0,
  });

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [topupDialog, setTopupDialog] = useState(false);

  return (
    <AppStateContext.Provider
      value={{
        balance,
        refetchBalance,
        conversation,
        setConversation,
        topupDialog,
        setTopupDialog,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
