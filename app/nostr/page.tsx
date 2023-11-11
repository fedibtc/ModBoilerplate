"use client";

import Center from "@/components/center";
import Container from "@/components/container";
import {
  NostrContext,
  NostrProvider,
  useNDKUser,
} from "@/components/providers/nostr-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/hooks/use-toast";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { NDKSubscription, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { useEffect, useRef, useState } from "react";

function NostrExample() {
  const user = useNDKUser();

  const [profile, setProfile] = useState<null | NDKUserProfile>(
    user?.profile ?? null,
  );

  const { toast } = useToast();

  const sub = useRef<NDKSubscription | null>(null);

  const copyNpub = async () => {
    try {
      await navigator.clipboard.writeText(user.npub);
      toast({
        content: "Copied to clipboard",
      });
    } catch (err) {
      console.log(err);
      toast({
        content: (err as any).message,
      });
    }
  };

  useEffect(() => {
    if (user && !user.profile) {
      try {
        user
          .fetchProfile()
          .then((p) => setProfile(p))
          .catch((err) => {
            throw err;
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  return (
    <div className="flex flex-col grow gap-lg items-center justify-center">
      <Text variant="h2">Nostr Demo</Text>

      {profile && (
        <div className="flex gap-md items-center w-full">
          <Avatar
            id={Math.random().toString(36).slice(2)}
            size="md"
            src={profile.image}
            name={profile.displayName || profile.name}
            shape="square"
          />

          <div className="flex flex-col gap-xxs grow">
            <Text weight="bold" ellipsize>
              {profile.displayName || profile.name}
            </Text>
            <Text className="text-grey" variant="caption" ellipsize>
              @{profile.name}
            </Text>
            {profile.bio && (
              <Text className="text-lightGrey" variant="small">
                {profile.bio}
              </Text>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-sm items-end w-full">
        <Input value={user.npub} label="Nostr Pubkey" readOnly />
        <Button
          variant="tertiary"
          type="button"
          className="px-0 w-[44px] shrink-0"
          onClick={copyNpub}
        >
          <Icon icon="IconCopy" size="md" />
        </Button>
      </div>
    </div>
  );
}

export default function Nostr() {
  return (
    <NostrProvider>
      <Container>
        <NostrContext.Consumer>
          {(ctx) => (
            <>
              {ctx?.isLoading && (
                <Center>
                  <Icon className="animate-spin" icon="IconLoader2" />
                </Center>
              )}
              {ctx?.error && (
                <Center>
                  <div className="flex flex-col gap-sm">
                    <Text variant="h2" weight="bold">
                      Error
                    </Text>
                    <Text>{ctx.error.message}</Text>
                  </div>
                </Center>
              )}
              {ctx?.ndk && ctx.user && <NostrExample />}
            </>
          )}
        </NostrContext.Consumer>
      </Container>
    </NostrProvider>
  );
}
