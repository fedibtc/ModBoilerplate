"use client";
import { createContext, use, useEffect, useState } from "react";
import { WebLNProvider } from "@webbtc/webln-types";

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
  const [webln, setWebln] = useState<WebLNProvider | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        if (typeof window.webln === "undefined") {
          throw new Error("Could not find a WebLN Provider");
        }

        await window.webln.enable();

        if (
          ("isEnabled" in window.webln &&
            typeof window.webln.isEnabled === "function" &&
            (await window.webln?.isEnabled())) ||
          ("isEnabled" in window.webln &&
            typeof window.webln.isEnabled === "boolean" &&
            window.webln.isEnabled) ||
          ("_isEnabled" in window.webln && window.webln?.isEnabled)
        ) {
          setWebln(window.webln);
          setIsLoading(false);
        } else {
          throw new Error("Could not enable WebLN Provider");
        }
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    }
    init();
  }, []);

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
