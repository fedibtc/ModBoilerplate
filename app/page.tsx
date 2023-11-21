"use client";

import Container from "@/components/container";
import { AppStateProvider } from "@/components/providers/app-state-provider";
import {
  NostrProvider,
  useNDKContext,
} from "@/components/providers/nostr-provider";
import {
  WebLNProvider,
  useWebLNContext,
} from "@/components/providers/webln-provider";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import Chat from "./chat";
import TopupDialog from "./topup";

function Fallback() {
  const { isLoading, error } = useNDKContext();
  const { isLoading: weblnLoading, error: weblnError } = useWebLNContext();

  if (isLoading || weblnLoading) {
    return (
      <Container center>
        <Icon
          icon="IconLoader2"
          size="xl"
          className="animate-load text-lightGrey"
        />
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
    <AppStateProvider>
      <Container className="divide-y divide-y-extraLightGrey items-stretch">
        <Chat />
      </Container>
      <TopupDialog />
    </AppStateProvider>
  );
}

export default function Index() {
  return (
    <NostrProvider>
      <WebLNProvider>
        <Fallback />
      </WebLNProvider>
    </NostrProvider>
  );
}
