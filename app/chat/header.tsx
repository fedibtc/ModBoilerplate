import { useAppState } from "@/components/providers/app-state-provider";
import Icon from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { mutateWithBody } from "@/lib/rest";
import { useMutation } from "@tanstack/react-query";

export default function Header() {
  const { conversation, setConversation, balance } = useAppState();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      mutateWithBody<void>(
        "/chat",
        {
          conversationId: conversation!.id,
        },
        "DELETE",
      ),
    onSuccess: () => {
      setConversation(null);
    },
    onError: () => {
      alert("Failed to delete conversation");
    },
  });

  const deleteConversation = () => {
    const shouldDelete = confirm(
      "Are you sure you want to delete this conversation?",
    );

    if (shouldDelete) {
      mutate();
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
          icon={isPending ? "IconLoader2" : "IconTrash"}
          className={isPending ? "animate-load" : ""}
        />
      </button>
    </div>
  );
}
