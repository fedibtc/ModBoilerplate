"use client"

import { formatError } from "@/lib/errors"
import { Icon, Text, useFediInjectionContext } from "@fedibtc/ui"
import Container from "./container"
import { useAuth } from "./providers/auth-provider"

export default function Fallback({ children }: { children: React.ReactNode }) {
  const { isLoading, status, error: injectionError } = useFediInjectionContext()
  const { isLoading: isAuthLoading, error: authError } = useAuth()

  const statusMessage: Record<typeof status, string> = {
    success: "Success",
    error: "Error",
    checking_injections: "Establishing Connection",
    loading_nostr: "Loading Nostr",
    loading_webln: "Loading WebLN",
    loading_fedi_api: "Connecting to Fedi",
  }

  const error = injectionError || authError

  if (isLoading || isAuthLoading) {
    return (
      <Container>
        <Icon
          icon="IconLoader2"
          size="lg"
          className="animate-spin text-lightGrey"
        />
        <Text>{isLoading ? statusMessage[status] : "Authenticating"}...</Text>
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
