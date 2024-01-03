import { NostrProvider } from "@/components/providers/nostr-provider";
import { WebLNProvider } from "@/components/providers/webln-provider";
import Chat from "./chat";

export default async function Index() {
  return (
    <NostrProvider>
      <WebLNProvider>
        <Chat />
      </WebLNProvider>
    </NostrProvider>
  );
}
