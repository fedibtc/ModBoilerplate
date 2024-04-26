export {}

declare global {
  interface Window {
    fediInternal?: {
      generateEcash(amountMsat: {
        amount?: string | number
        defaultAmount?: string | number
        minimumAmount?: string | number
        maximumAmount?: string | number
      }): Promise<string>
      receiveEcash(ecash: string): Promise<string>
      getActiveFederation(): Promise<{
        id: string
        name: string
        network: "signet" | "bitcoin"
      }>
      getAuthenticatedMember(): Promise<{
        id: string
        username: string
      }>
      getCurrencyCode?: () => Promise<string>
      getLanguageCode?: () => Promise<string>
    }
  }
}
