import { NostrProvider } from "@/components/providers/nostr-provider";
import { WebLNProvider } from "@/components/providers/webln-provider";
import Chat from "./chat";
import { AppStateProvider } from "@/components/providers/app-state-provider";

export default async function Index() {
  return (
    <AppStateProvider>
      <NostrProvider>
        <WebLNProvider>
          <Chat />
        </WebLNProvider>
      </NostrProvider>
    </AppStateProvider>
  );
}
