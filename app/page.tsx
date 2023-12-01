"use client";

import Container from "@/components/container";
import Icon from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import Link from "next/link";

export default function Index() {
  return (
    <Container>
      <Text variant="h1" weight="bolder" className="text-center">
        Fedi Mod Boilerplate
      </Text>

      <Text className="text-center">
        Beautiful components • Nostr & Lightning Utilities
      </Text>

      <Text>
        <ul className="flex flex-col gap-md">
          <li>
            <Link
              href="/playground"
              className="text-grey inline-flex gap-sm items-center"
            >
              <span>Component Playground</span>
              <Icon icon="IconChevronRight" />
            </Link>
          </li>
          <li>
            <Link
              href="/webln"
              className="text-grey inline-flex gap-sm items-center"
            >
              <span>WebLN Example</span>
              <Icon icon="IconChevronRight" />
            </Link>
          </li>
          <li>
            <Link
              href="/nostr"
              className="text-grey inline-flex gap-sm items-center"
            >
              <span>Nostr Example</span>
              <Icon icon="IconChevronRight" />
            </Link>
          </li>
          <li>
            <Link
              href="/payment"
              className="text-grey inline-flex gap-sm items-center"
            >
              <span>Secure Lighting Payment</span>
              <Icon icon="IconChevronRight" />
            </Link>
          </li>
        </ul>
      </Text>
    </Container>
  );
}
