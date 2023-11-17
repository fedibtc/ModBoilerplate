import { useAppState } from "@/components/providers/app-state-provider";
import Icon from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useMutation } from "@tanstack/react-query";

export default function Header() {
  const { conversation } = useAppState();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(0);
        }, 1000);
      });
    },
    onSuccess: () => {
      // TODO: navigate to conversation list
    },
    onError: () => {
      alert("Failed to delete conversation");
    },
  });

  const exitChat = () => {
    console.log("Exit chat");
  };

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
        onClick={exitChat}
      >
        <Icon icon="IconMenu2" />
      </button>
      <Text className="grow">{conversation!.title}</Text>
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