"use client";

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
import { useState } from "react";
import Chat from "./chat";

function Fallback() {
  const { isLoading, error } = useNDKContext();
  const { isLoading: weblnLoading, error: weblnError } = useWebLNContext();

  const [open, setOpen] = useState(false);

  if (isLoading || weblnLoading) {
    return (
      <div className="flex items-center justify-center grow w-full h-full max-w-[480px]">
        <Icon
          icon="IconLoader2"
          size="xl"
          className="animate-load text-lightGrey"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-lg items-center justify-center grow w-full h-full max-w-[480px]">
        <Text variant="h2" weight="bold" className="text-center">
          Nostr Provider Required
        </Text>
        <Text className="text-center">
          A Nostr Provider is required in order to run this application.
        </Text>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }

  if (weblnError) {
    return (
      <div className="flex flex-col gap-lg items-center justify-center grow w-full h-full max-w-[480px]">
        <Text variant="h2" weight="bold" className="text-center">
          WebLN Provider Required
        </Text>
        <Text className="text-center">
          A WebLN Provider is required in order to run this application.
        </Text>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }

  return (
    <AppStateProvider>
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col grow w-full h-full max-w-[480px] divide-y divide-extraLightGrey">
          <Chat />
        </div>
      </div>
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
