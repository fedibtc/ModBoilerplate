"use client";

import {
  AppStateProvider,
  useAppState,
} from "@/components/providers/app-state-provider";
import Conversation from "./conversation";
import EmptyState from "./empty";
import Container from "@/components/container";
import { useNDKContext } from "@/components/providers/nostr-provider";
import { Button, Icon, Text, useWebLNContext } from "@fedibtc/ui";
import TopupDialog from "../topup";

export default function Chat() {
  const { isLoading, error } = useNDKContext();
  const { isLoading: weblnLoading, error: weblnError } = useWebLNContext();

  if (isLoading || weblnLoading) {
    return (
      <Container center>
        <Icon
          icon="IconLoader2"
          size="xl"
          className="animate-spin text-lightGrey"
        />
        <Text>
          {weblnLoading ? "Initializing WebLN..." : "Initializing Nostr..."}
        </Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container center>
        <Text variant="h2" weight="bold" className="text-center">
          Nostr Provider Required
        </Text>
        <Text className="text-center">
          A Nostr Provider is required in order to run this application.
        </Text>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </Container>
    );
  }

  if (weblnError) {
    return (
      <Container center>
        <Text variant="h2" weight="bold" className="text-center">
          WebLN Provider Required
        </Text>
        <Text className="text-center">
          A WebLN Provider is required in order to run this application.
        </Text>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </Container>
    );
  }

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
