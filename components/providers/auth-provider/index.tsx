"use client";

import { useFediInjectionContext } from "@fedibtc/ui";
import { User } from "@prisma/client";
import { Event, UnsignedEvent, getEventHash } from "nostr-tools";
import { createContext, useContext, useEffect, useState } from "react";
import { connect, login } from "./actions";

interface AuthContextType {
  isLoading: boolean;
  error: Error | null;
  user: User | null;
}

interface AuthContextLoading extends AuthContextType {
  isLoading: true;
  error: null;
  user: null;
}

interface AuthContextError extends AuthContextType {
  isLoading: false;
  error: Error;
  user: null;
}

interface AuthContextUser extends AuthContextType {
  isLoading: false;
  error: null;
  user: User;
}

export type AuthContextValue =
  | AuthContextLoading
  | AuthContextError
  | AuthContextUser;

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const { nostr, nostrPubkey, status } = useFediInjectionContext();

  useEffect(() => {
    async function attemptLogin() {
      try {
        if (!nostr) throw new Error("No nostr provider found");

        const connectionRes = await connect({ pubkey: nostrPubkey });

        if (!connectionRes.success) throw new Error(connectionRes.message);

        if ("user" in connectionRes.data) {
          setUser(connectionRes.data.user);
          setIsLoading(false);
        } else {
          const evt: UnsignedEvent = {
            kind: 22242,
            created_at: Math.floor(Date.now() / 1000),
            tags: [["challenge", connectionRes.data.sigToken]],
            content: "Log into AI Assistant",
            pubkey: nostrPubkey,
          };

          const event: Omit<Event, "sig"> = {
            ...evt,
            id: getEventHash(evt),
          };

          const signedEvent: Event = (await nostr.signEvent(event)) as Event;

          const loginRes = await login(signedEvent);

          if (!loginRes.success) throw new Error(loginRes.message);

          if (!loginRes.data?.user)
            throw new Error("No user returned from login");

          setUser(loginRes.data.user);
          setIsLoading(false);
        }
      } catch (e) {
        setError(e as Error);
        setIsLoading(false);
      }
    }

    if (nostr && status === "success") {
      attemptLogin();
    }
  }, [nostr, nostrPubkey, status]);

  return (
    <AuthContext.Provider
      value={
        {
          isLoading,
          error,
          user,
        } as AuthContextValue
      }
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
