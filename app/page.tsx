"use client";

import Container from "@/components/container";
import {
  AppStateProvider,
  useAppState,
} from "@/components/providers/app-state-provider";
import Conversation from "./chat/conversation";
import EmptyState from "./chat/empty";
import TopupDialog from "./topup";

export default function Chat() {
  return (
    <>
      <Container className="divide-y divide-y-extraLightGrey items-stretch">
        <AppStateProvider>
          <ConversationOrEmpty />
        </AppStateProvider>
      </Container>
    </>
  );
}

function ConversationOrEmpty() {
  const { conversation } = useAppState();

  return (
    <>
      {conversation ? <Conversation /> : <EmptyState />}
      <TopupDialog />
    </>
  );
}
