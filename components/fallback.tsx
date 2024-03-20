"use client";

import {
  Icon,
  Text,
  formatError,
  useNostrContext,
  useWebLNContext,
} from "@fedibtc/ui";
import { useEffect, useState } from "react";
import Container from "./container";
import { useAuth } from "./providers/auth-provider";

export default function Fallback({ children }: { children: React.ReactNode }) {
  const { isLoading: isWeblnLoading, error: weblnError } = useWebLNContext();
  const { isLoading: isNostrLoading, error: nostrError } = useNostrContext();
  const { isLoading: isAuthLoading, error: authError } = useAuth();

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if ("fediInternal" in window) {
      window.fediInternal?.getActiveFederation().then((res) => {
        let networkError: Error | null = null;

        if (res.network !== "bitcoin") {
          networkError = new Error(
            "Invalid bitcoin network. Only mainnet federations are supported.",
          );
        }

        setError(networkError || weblnError || nostrError || authError);
      });
    } else {
      setError(weblnError || nostrError || authError);
    }
  }, [weblnError, nostrError, authError]);

  if (isWeblnLoading) {
    return (
      <Container>
        <Icon
          icon="IconLoader2"
          size="lg"
          className="animate-spin text-lightGrey"
        />
        <Text>Initializing WebLN...</Text>
      </Container>
    );
  }

  if (isNostrLoading) {
    return (
      <Container>
        <Icon
          icon="IconLoader2"
          size="lg"
          className="animate-spin text-lightGrey"
        />
        <Text>Initializing Nostr...</Text>
      </Container>
    );
  }

  if (isAuthLoading) {
    return (
      <Container>
        <Icon
          icon="IconLoader2"
          size="lg"
          className="animate-spin text-lightGrey"
        />
        <Text>Authenticating...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="p-2">
        <Icon icon="IconCircleX" size="lg" className="text-lightGrey" />
        <Text variant="h2" weight="bold">
          An Error Occurred
        </Text>
        <Text className="text-center">{formatError(error)}</Text>
      </Container>
    );
  }

  return <Container>{children}</Container>;
}
