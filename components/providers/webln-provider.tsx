"use client";
import { useQuery } from "@tanstack/react-query";
import { createContext, use } from "react";
import { WebLNProvider } from "webln";

export interface WebLNContextResult {
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

interface WebLNPending extends WebLNContextResult {
  webln: undefined;
  isLoading: true;
  error: null;
}

interface WebLNErrorResult extends WebLNContextResult {
  webln: undefined;
  isLoading: false;
  error: Error;
}

interface WebLNSuccessResult extends WebLNContextResult {
  webln: WebLNProvider;
  isLoading: false;
  error: null;
}

export type WebLNProviderType =
  | WebLNPending
  | WebLNErrorResult
  | WebLNSuccessResult;

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
      value={
        {
          webln,
          isLoading,
          error,
        } as WebLNProviderType
      }
    >
      {children}
    </WebLNContext.Provider>
  );
}

/**
 * Returnes the value of `WebLNContext`. Throws an error if not used within a WebLNProvider.
 */
export function useWebLNContext(): WebLNProviderType {
  const res = use(WebLNContext);

  if (res === null) {
    throw new Error("useWebLNContext must be used within a WebLNProvider");
  }

  return res;
}

/**
 * Returns a `WebLNProvider` instance. Throws an error if not used in a WebLNProvider or if not initialized.
 */
export function useWebLN(): WebLNProvider {
  const res = useWebLNContext();

  if (typeof res.webln === "undefined") {
    throw new Error("WebLN provider is not connected");
  }

  return res.webln;
}
