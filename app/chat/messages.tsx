import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { Message } from "@prisma/client";

function Message({ message }: { message: Message }) {
  const isSystem = message.role === "SYSTEM";

  return (
    <div
      className={`flex ${
        isSystem ? "flex-row" : "flex-row-reverse"
      } items-end gap-sm`}
    >
      {isSystem && (
        <Avatar
          id={String(message.id)}
          name="system"
          size="sm"
          className="shrink-0"
        />
      )}
      <div className="flex flex-col gap-xs">
        {isSystem && <Text variant="caption">system</Text>}
        <div
          className={`p-2 rounded-xl ${
            isSystem ? "bg-green/10 rounded-bl-md" : "bg-blue/10 rounded-br-md"
          }`}
        >
          <Text variant="body">{message.content}</Text>
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  return (
    <div className="grow relative">
      <div className="absolute inset-0 flex flex-col gap-md overflow-auto px-md py-sm">
        <Message
          message={{
            id: 1,
            content:
              "Oh hi this is a test asdhfiu ashdifh iuasdhfiu hasdui fhi iufa shdiuf hasiud hfiuasd hiuf asdui fhuiasd hfui asdhiuf hasduif hasuid hfiuasd hfiuasd hfiuasd hui",
            conversationID: 1,
            role: "SYSTEM",
          }}
        />
        <Message
          message={{
            id: 2,
            content: "Hello",
            conversationID: 1,
            role: "USER",
          }}
        />
        <Message
          message={{
            id: 3,
            content: "Oh hi this is another test",
            conversationID: 1,
            role: "SYSTEM",
          }}
        />
        <Message
          message={{
            id: 4,
            content: "Oh cool so what's up?",
            conversationID: 1,
            role: "USER",
          }}
        />
      </div>
    </div>
  );
}
