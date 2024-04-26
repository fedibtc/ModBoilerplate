"use client"

import {
  QueryClientProvider as ClientProvider,
  QueryClient,
} from "@tanstack/react-query"

const queryClient = new QueryClient()

/**
 * The equivalent of @tanstack/react-query's `QueryClientProvider`, forwarded with "use client".
 */
export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientProvider client={queryClient}>{children}</ClientProvider>
}
