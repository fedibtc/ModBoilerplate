"use client";
import { RELAYS } from "@/lib/constants";
import NDK, { NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk";
import { useQuery } from "@tanstack/react-query";
import { createContext, use } from "react";

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

type NostrProviderType =
  | NostrPending
  | NostrErrorResult
  | NostrSuccessResult;

export const NostrContext = createContext<NostrProviderType | null>(null);

/**
 * Connects to `window.nostr`, initializing and exposing `user` and `ndk` through `NostrConnectionContext`.
 */
export function NostrProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ndk"],
    queryFn: async () => {
      try {
        const signer = new NDKNip07Signer();
        const ndk = new NDK({
          explicitRelayUrls: RELAYS,
          signer,
        });

        ndk.pool.on("relay:connect", async (r: any) => {
          console.log(`Connected to a relay ${r.url}`);
        });

        ndk.connect(2500);

        const user = await signer.user();

        document.cookie = "npub=" + user.npub;

        return { user, ndk };
      } catch (err) {
        throw new Error((err as any).message);
      }
    },
  });

  return (
    <NostrContext.Provider
      value={{
        user: data?.user,
        ndk: data?.ndk,
        isLoading,
        error,
      } as NostrProviderType}
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

  if(res === null) {
    throw new Error("useNDKContext must be used within a NostrProvider")  
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
