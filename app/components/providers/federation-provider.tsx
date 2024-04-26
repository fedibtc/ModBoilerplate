"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface ProvidedFederationType {
  id: string
  name: string
  network: "bitcoin" | "signet"
  username?: string
}

interface FederationContextLoading {
  value: null
  isLoading: true
  error: null
}

interface FederationContextError {
  value: null
  isLoading: false
  error: Error
}

interface FederationContextSuccess {
  value: ProvidedFederationType
  isLoading: false
  error: null
}

type FederationContextValue =
  | FederationContextLoading
  | FederationContextError
  | FederationContextSuccess

const FederationContext = createContext<FederationContextValue | null>(null)

const environment = process.env.NEXT_PUBLIC_ENV

export function FederationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [value, setValue] = useState<ProvidedFederationType | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function run() {
      setIsLoading(true)
      try {
        if (!window.fediInternal)
          throw new Error(
            "Please update the Fedi app to the latest version to use Multispend",
          )

        const currentFederation =
          await window.fediInternal.getActiveFederation()
        const currentMember = await window.fediInternal.getAuthenticatedMember()

        if (!currentFederation)
          throw new Error(
            "Could not fetch the current federation. Please update the Fedi app and try again.",
          )

        if (environment === "preview" && currentFederation.network !== "signet")
          throw new Error(
            "The Preview Version of Multispend only supports Signet federations",
          )

        if (
          environment === "production" &&
          currentFederation.network !== "bitcoin"
        )
          throw new Error(
            `Multispend does not support signet or testnet federations.`,
          )

        setValue({
          ...currentFederation,
          username: currentMember?.username ?? undefined,
        })
      } catch (e) {
        setError(e as Error)
      } finally {
        setIsLoading(false)
      }
    }

    run()
  }, [])

  return (
    <FederationContext.Provider
      value={
        {
          value,
          isLoading,
          error,
        } as FederationContextValue
      }
    >
      {children}
    </FederationContext.Provider>
  )
}

export const useFederationContext = () => {
  const value = useContext(FederationContext)

  if (!value)
    throw new Error(
      "useFederationContext must be used within a FederationProvider",
    )

  return value
}

export const useFederation = () => {
  const value = useFederationContext() as FederationContextSuccess

  if (!value.value)
    throw new Error("useFederationContext was not successfully initialized")

  return value.value
}
