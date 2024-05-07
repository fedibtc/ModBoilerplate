import { FediInjectionProvider, ToastProvider } from "@fedibtc/ui"
import "@fedibtc/ui/dist/index.css"
import type { Metadata } from "next"
import { Albert_Sans } from "next/font/google"
import Fallback from "./components/fallback"
import { AuthProvider } from "./components/providers/auth-provider"
import "./globals.css"
import { fediModName } from "@/lib/constants"

const albertSans = Albert_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: fediModName,
  description: "Securely share sats with your friends",
  icons: ["logo.png"],
}

const env = process.env.NEXT_PUBLIC_ENV

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={albertSans.className}>
        <ToastProvider>
          <FediInjectionProvider
            fediModName={fediModName}
            minSupportedAPIVersion="legacy"
            supportedBitcoinNetworks={{
              signet: env !== "production",
              bitcoin: env !== "preview",
            }}
          >
            <AuthProvider>
              <Fallback>{children}</Fallback>
            </AuthProvider>
          </FediInjectionProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
