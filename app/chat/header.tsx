import { useAppState } from "@/components/providers/app-state-provider";
import { Icon, Text, useToast } from "@fedibtc/ui";
import { useState } from "react";
import { deleteChat } from "./actions/delete";

export default function Header() {
  const { conversation, setConversation, balance } = useAppState();

  const [deleteChatPending, setDeleteChatPending] = useState(false);

  const toast = useToast();

  const deleteConversation = async () => {
    if (!conversation) return;

    const shouldDelete = confirm(
      "Are you sure you want to delete this conversation?",
    );

    if (shouldDelete) {
      setDeleteChatPending(true);

      const res = await deleteChat({
        conversationId: conversation.id,
      });

      if (!res.success) {
        toast.show({
          content: res.message,
          status: "error",
        });
      } else {
        setConversation(null);
      }

      setDeleteChatPending(false);
    }
  };

  return (
    <div className="flex gap-sm py-sm px-md items-center">
      <button
        className="w-6 h-6 shrink-0 flex items-center justify-center"
        onClick={() => setConversation(null)}
      >
        <Icon icon="IconChevronLeft" />
      </button>
      <Text className="grow" variant="caption" ellipsize>
        {conversation!.title}
      </Text>
      <Text className="text-grey shrink-0" variant="caption" ellipsize>
        {balance?.balance} Sats
      </Text>
      <button
        className="w-6 h-6 shrink-0 flex items-center justify-center text-grey"
        onClick={deleteConversation}
      >
        <Icon
          icon={deleteChatPending ? "IconLoader2" : "IconTrash"}
          className={deleteChatPending ? "animate-load" : ""}
        />
      </button>
    </div>
  );
}
