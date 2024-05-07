import Fallback from "@/components/fallback";
import { AuthProvider } from "@/components/providers/auth-provider";
import QueryClientProvider from "@/components/providers/query-client-provider";
import { ToastProvider, FediInjectionProvider } from "@fedibtc/ui";
import "@fedibtc/ui/dist/index.css";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "AI Assistant " + (process.env.NODE_ENV === "development" ? "🛠️" : "⚡️"),
  description: "Sats for Chats",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const env = process.env.NEXT_PUBLIC_ENV;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider>
          <FediInjectionProvider
            fediModName="AI Assistant"
            minSupportedAPIVersion="legacy"
            supportedBitcoinNetworks={{
              signet: env !== "production",
              bitcoin: env !== "preview",
            }}
          >
            <AuthProvider>
              <Fallback>
                <QueryClientProvider>{children}</QueryClientProvider>
              </Fallback>
            </AuthProvider>
          </FediInjectionProvider>
        </ToastProvider>

        <Analytics />
      </body>
    </html>
  );
}
