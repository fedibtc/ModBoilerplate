import Fallback from "@/components/fallback";
import { AuthProvider } from "@/components/providers/auth-provider";
import QueryClientProvider from "@/components/providers/query-client-provider";
import { ToastProvider, FediInjectionProvider } from "@fedibtc/ui";
import "@fedibtc/ui/dist/index.css";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "./globals.css";

const env = process.env.NEXT_PUBLIC_ENV;

export const metadata: Metadata = {
  title: `AI Assistant${env === "development" ? " 🔧" : env === "preview" ? " 🎤" : "⚡️"}`,
  description: "Sats for Chats",
  icons: [
    env === "production"
      ? "logo.png"
      : env === "preview"
        ? "logo-preview.png"
        : "logo-dev.png",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

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
              bitcoin: env === "production",
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
