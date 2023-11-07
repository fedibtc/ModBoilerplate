"use client";

import {
  QueryClient,
  QueryClientProvider as ClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

/**
 * The equivalent of @tanstack/react-query's `QueryClientProvider`, transformed into a client component.
 */
export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientProvider client={queryClient}>{children}</ClientProvider>;
}
