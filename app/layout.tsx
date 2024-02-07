import QueryClientProvider from "@/components/providers/query-client-provider";
import { Toaster } from "@fedibtc/ui";
import "@fedibtc/ui/dist/index.css";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fedi Mod Boilerplate",
  description: "Edit description",
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
