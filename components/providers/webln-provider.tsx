"use client";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { WebLNProvider } from "webln";

export interface WebLNProviderType {
  webln: WebLNProvider | undefined;
  /**
   * Whether the webln connection is loading
   */
  isLoading: boolean;
  /**
   * If an error occurred in attempt to connect to Nostr.
   */
  error: Error | null;
}

export const WebLNContext = createContext<WebLNProviderType | null>(null);

/**
 * Connects to `window.webln`, enabling and exposing `webln` through `WebLNContext`.
 */
export function WebLNProvider({ children }: { children: React.ReactNode }) {
  const {
    data: webln,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["webln"],
    queryFn: async () => {
      if (typeof window.webln === "undefined") {
        throw new Error("Could not find a WebLN Provider");
      }

      await window.webln.enable();
      return window.webln;
    },
  });

  return (
    <WebLNContext.Provider
      value={{
        webln,
        isLoading,
        error,
      }}
    >
      {children}
    </WebLNContext.Provider>
  );
}

/**
 * Returns a `WebLNProvider` instance. Throws an error if not used in a WebLNProvider or if not initialized.
 */
export function useWebLN(): WebLNProvider {
  const res = useContext(WebLNContext);

  if (res === null) {
    throw new Error("useWebLN must be used within a WebLNProvider");
  }

  if (typeof res.webln === "undefined") {
    throw new Error("WebLN provider is not connected");
  }

  return res.webln;
}

/**
 * Returnes the value of `WebLNContext`. Throws an error if not used within a WebLNProvider.
 */
export function useWebLNContext(): WebLNProviderType {
  const res = useContext(WebLNContext);

  if (res === null) {
    throw new Error("useWebLNContext must be used within a WebLNProvider");
  }

  return res;
}
