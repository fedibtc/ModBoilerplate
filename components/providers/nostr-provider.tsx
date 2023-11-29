"use client";
import { RELAYS } from "@/lib/constants";
import NDK, { NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk";
import { createContext, use, useEffect, useState } from "react";

export interface NostrContextResult {
  /**
   * A connected instance of the Nostr Dev Kit class
   */
  ndk: NDK | undefined;
  /**
   * An NDKUser instance representing the current user over `window.nostr`
   */
  user: NDKUser | undefined;
  /**
   * Whether the Nostr connection is loading
   */
  isLoading: boolean;
  /**
   * If an error occurred in attempt to connect to Nostr.
   */
  error: Error | null;
}

interface NostrPending extends NostrContextResult {
  ndk: undefined;
  user: undefined;
  isLoading: true;
  error: null;
}

interface NostrErrorResult extends NostrContextResult {
  ndk: undefined;
  user: undefined;
  isLoading: false;
  error: Error;
}

interface NostrSuccessResult extends NostrContextResult {
  ndk: NDK;
  user: NDKUser;
  isLoading: false;
  error: null;
}

type NostrProviderType = NostrPending | NostrErrorResult | NostrSuccessResult;

export const NostrContext = createContext<NostrProviderType | null>(null);

/**
 * Connects to `window.nostr`, initializing and exposing `user` and `ndk` through `NostrConnectionContext`.
 */
export function NostrProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<{ user: NDKUser; ndk: NDK } | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const signer = new NDKNip07Signer();
        const ndk = new NDK({
          explicitRelayUrls: RELAYS,
          signer,
        });

        await ndk.connect(2500);

        if (
          "nostr" in window &&
          window.nostr &&
          (("isEnabled" in window?.nostr &&
            typeof window.nostr.isEnabled === "function" &&
            (await window.nostr?.isEnabled())) ||
            ("isEnabled" in window?.nostr &&
              typeof window.nostr.isEnabled === "boolean" &&
              window.nostr.isEnabled) ||
            ("_isEnabled" in window?.nostr && window.nostr?._isEnabled))
        ) {
          const user = await signer.user();

          document.cookie = "npub=" + user.npub;
          setData({ user, ndk });
          setIsLoading(false);
        } else {
          throw new Error("Could not connect to Nostr");
        }
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    }
    init();
  }, []);

  return (
    <NostrContext.Provider
      value={
        {
          user: data?.user,
          ndk: data?.ndk,
          isLoading,
          error,
        } as NostrProviderType
      }
    >
      {children}
    </NostrContext.Provider>
  );
}

/**
 * Returnes the value of `NostrContext`. Throws an error if not used within a NostrProvider.
 */
export function useNDKContext(): NostrProviderType {
  const res = use(NostrContext);

  if (res === null) {
    throw new Error("useNDKContext must be used within a NostrProvider");
  }

  return res;
}

/**
 * Returns a Nostr NDK instance. Throws an error if not used in a NostrProvider or if not initialized.
 */
export function useNDK(): NDK {
  const res = useNDKContext();

  if (typeof res.ndk === "undefined") {
    throw new Error("Nostr provider is not connected");
  }

  return res.ndk;
}

/**
 * Returns an NDKUser instance representing the current user over `window.nostr`. Throws an error if not used in a NostrProvider or if not initialized.
 */
export function useNDKUser(): NDKUser {
  const res = useNDKContext();

  if (typeof res.user === "undefined") {
    throw new Error("Nostr provider is not connected");
  }

  return res.user;
}
