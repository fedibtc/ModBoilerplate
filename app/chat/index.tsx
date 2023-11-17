import { useAppState } from "@/components/providers/app-state-provider";
import Conversation from "./conversation";
import EmptyState from "./empty";

export default function Chat() {
  const { balance, conversation, setConversation } = useAppState();

  return conversation ? <Conversation /> : <EmptyState />;
}
