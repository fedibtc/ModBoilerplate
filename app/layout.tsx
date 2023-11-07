import "./globals.css";
import QueryClientProvider from "@/components/providers/query-client-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fedi Mod Boilerplate",
  description: "Edit description",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
