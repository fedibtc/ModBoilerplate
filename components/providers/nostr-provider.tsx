"use client";
import { User } from "@prisma/client";
import { createContext, use, useEffect, useState } from "react";
import { UnsignedEvent, getEventHash, Event } from "nostr-tools";

declare global {
  interface Window {
    nostr?: {
      getPublicKey: () => Promise<string>;
      signEvent: (event: Omit<Event, "sig">) => Promise<Event>;
    };
  }
}

export interface NostrContextResult {
  user: User | undefined;
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
  user: User;
  isLoading: false;
  error: null;
}

type NostrProviderType = NostrPending | NostrErrorResult | NostrSuccessResult;

export const NostrContext = createContext<NostrProviderType | null>(null);

/**
 * Connects to `window.nostr`, initializing and exposing `user` and `ndk` through `NostrConnectionContext`.
 */
export function NostrProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<{ user: User } | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        if (typeof window.nostr === "undefined") return;

        const pubkey = await window.nostr.getPublicKey();

        const res = await window
          .fetch("/api/login?pk=" + pubkey)
          .then((r) => r.json());

        if (!res.success) throw new Error(res.message);

        const {
          data: { refreshToken },
        }: { data: { refreshToken: string } } = res;

        const evt: UnsignedEvent = {
          kind: 1,
          created_at: Math.floor(Date.now() / 1000),
          tags: [],
          content: "Please sign this text to log in: " + refreshToken,
          pubkey,
        };

        const event: Omit<Event, "sig"> = {
          ...evt,
          id: getEventHash(evt),
        };

        const signedEvent: Event = (await window.nostr.signEvent(
          event,
        )) as Event;

        const loginRes = await window
          .fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify(signedEvent),
          })
          .then((r) => r.json());

        if (loginRes.success) {
          setData(loginRes.data);
          setIsLoading(false);
          setError(null);
        }
      } catch (e) {
        setError(e as Error);
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
 * Returns an NDKUser instance representing the current user over `window.nostr`. Throws an error if not used in a NostrProvider or if not initialized.
 */
export function useNDKUser(): User {
  const res = useNDKContext();

  if (typeof res.user === "undefined") {
    throw new Error("Nostr provider is not connected");
  }

  return res.user;
}
