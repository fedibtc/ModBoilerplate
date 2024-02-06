import { Text } from "@fedibtc/ui";
import { Message as AIMessage } from "ai";

export default function Message({
  message,
  loading = false,
}: {
  message: Omit<AIMessage, "id">;
  loading?: boolean;
}) {
  const isSystem = message.role !== "user";

  return (
    <div
      className={`flex ${
        isSystem ? "flex-row" : "flex-row-reverse"
      } items-end gap-sm`}
    >
      <div className="flex flex-col gap-xs max-w-[95%]">
        <div
          className={`p-2 rounded-xl ${
            isSystem
              ? "bg-green/10 !rounded-bl-[4px]"
              : "bg-blue/10 !rounded-br-[4px]"
          } ${loading ? "animate-pulse" : ""}`}
        >
          <Text
            variant="body"
            className={loading ? `${loading ? "text-transparent" : ""}` : ""}
          >
            {message.content}
          </Text>
        </div>
      </div>
    </div>
  );
}
