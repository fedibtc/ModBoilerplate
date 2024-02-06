import QueryClientProvider from "@/components/providers/query-client-provider";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "@fedibtc/ui/dist/index.css";
import { Toaster } from "@fedibtc/ui";

export const metadata: Metadata = {
  title: "LnGPT " + (process.env.NODE_ENV === "development" ? "🛠️" : "⚡️"),
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider>
          {children}
          <Toaster />
        </QueryClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
