"use client";

import { useAppState } from "@/components/providers/app-state-provider";
import Conversation from "./conversation";
import EmptyState from "./empty";

export default function Chat() {
  const { conversation } = useAppState();

  return conversation ? <Conversation /> : <EmptyState />;
}
