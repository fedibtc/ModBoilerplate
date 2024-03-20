import { Text } from "@fedibtc/ui";
import { Message as AIMessage } from "ai";
import { marked } from "marked";
import { styled } from "react-tailwind-variants";
import sanitize from "sanitize-html";

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
          <MessageContent
            variant="body"
            loading={loading}
            dangerouslySetInnerHTML={{
              __html: sanitize(marked.parse(message.content) as string, {
                allowedTags: [
                  "strong",
                  "em",
                  "a",
                  "s",
                  "ul",
                  "ol",
                  "li",
                  "br",
                  "p",
                ],
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
}

const MessageContent = styled(Text, {
  base: "markdown",
  variants: {
    loading: {
      true: "text-transparent",
    },
  },
});
