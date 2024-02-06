import { NostrProvider } from "@/components/providers/nostr-provider";
import { WebLNProvider } from "@fedibtc/ui";
import Chat from "./chat";

export default function Index() {
  return (
    <NostrProvider>
      <WebLNProvider>
        <Chat />
      </WebLNProvider>
    </NostrProvider>
  );
}
