"use client";
import { User } from "@prisma/client";
import { createContext, use, useEffect, useState } from "react";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

declare global {
  interface Window {
    nostr?: {
      getPublicKey: () => Promise<string>;
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
  const [isNewUser, setIsNewUser] = useState(false);
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");

  const login = async () => {
    try {
      const npub = await window.nostr?.getPublicKey();

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          pin,
          npub,
        }),
      }).then((r) => r.json());

      if (!res.success) {
        throw new Error(res.message);
      } else {
        setData(res.data);
        setIsLoading(false);
        setOpen(false);
      }
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const npub = await window.nostr?.getPublicKey();

        let exists = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            npub,
          }),
        }).then((r) => r.json());

        if (!exists.success) {
          throw new Error(exists.message);
        }

        if (exists.user) {
          setData({ user: exists.user });
          setIsLoading(false);
        } else {
          setIsNewUser(!exists.success);
          setOpen(true);
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
          isLoading,
          error,
        } as NostrProviderType
      }
    >
      {children}
      <Dialog
        title={isNewUser ? "Create a PIN" : "Enter your PIN"}
        open={open}
        onOpenChange={() => {}}
        description={
          isNewUser
            ? "Create a 4-6 digit PIN to secure your account. Please write it down as this cannot be recovered."
            : "Please enter your PIN you created when you signed up."
        }
      >
        <div className="flex flex-col gap-2">
          <Input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="012345"
            maxLength={6}
          />
          <Button onClick={login}>Submit</Button>
        </div>
      </Dialog>
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
