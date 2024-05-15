"use client";

import { Icon, Text, useFediInjectionContext } from "@fedibtc/ui";
import Container from "./container";
import { useAuth } from "./providers/auth-provider";
import { formatError } from "@/lib/errors";

export default function Fallback({ children }: { children: React.ReactNode }) {
  const { isLoading, error: injectionError } = useFediInjectionContext();
  const { isLoading: isAuthLoading, error: authError } = useAuth();

  const error = injectionError || authError;

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

  if (isLoading || isAuthLoading) {
    return (
      <Container>
        <Icon
          icon="IconLoader2"
          size="lg"
          className="animate-spin text-lightGrey"
        />
        <Text>{isLoading ? "Loading" : "Authenticating"}...</Text>
      </Container>
    );
  }

  return <Container>{children}</Container>;
}
