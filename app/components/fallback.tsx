"use client"

import {
  Icon,
  Text,
  formatError,
  useNostrContext,
  useWebLNContext,
} from "@fedibtc/ui"
import Container from "./container"
import { useAuth } from "./providers/auth-provider"
import { useFederationContext } from "./providers/federation-provider"

export default function Fallback({ children }: { children: React.ReactNode }) {
  const { isLoading: isWeblnLoading, error: weblnError } = useWebLNContext()
  const { isLoading: isNostrLoading, error: nostrError } = useNostrContext()
  const { isLoading: isAuthLoading, error: authError } = useAuth()
  const { isLoading: isFederationLoading, error: federationError } =
    useFederationContext()

  const error = weblnError || nostrError || authError || federationError

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
    )
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
    )
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
    )
  }

  if (isFederationLoading) {
    return (
      <Container>
        <Icon
          icon="IconLoader2"
          size="lg"
          className="animate-spin text-lightGrey"
        />
        <Text>Connecting to Federation...</Text>
      </Container>
    )
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
    )
  }

  return <Container>{children}</Container>
}
