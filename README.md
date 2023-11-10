# Fedi Mod Boilerplate

## Providers

### NostProvider
[NostrProvider](/components/providers/nostr-provider.tsx) connects to `window.nostr` through `@nostr-dev-kit/ndk`/`NDKNip07Signer()` and provides the Nostr `ndk` and `user` via `NostrContext`.

#### Hooks
- `useNDKUser()` - Returns an NDKUser instance representing the current user over `window.nostr`. Throws an error if not used in a NostrProvider or if not initialized.
- `Returns a Nostr NDK instance. Throws an error if not used in a NostrProvider or if not initialized.`

### WebLNProvider
[WebLNProvider](/components/providers/webln-provider.tsx) enables `window.webln` if it isn't undefined and provides an awaited and enabled `WebLNProvider` through `WebLNContext`.

### Hooks
- `useWebLN()` - Returns a `WebLNProvider` instance. Throws an error if not used in a WebLNProvider or if not initialized.

## Utilities

### Redis
[Redis](lib/server/redis.ts) returns initialized Redis client, requiring the `REDIS_URL` environment variable conditionally based on the `NODE_ENV`. Requires a `REDIS_URL` in production.

### InvoiceUtility
[InvoiceUtility](lib/server/lightning/invoice.ts) Utilizes the Alby API over a personal access token for simplicity, and uses Redis to verify payments.

Requires an environment variable `ALBY_ACCESS_TOKEN`. You can create an access token [here](https://getalby.com/developer/access_tokens/new).

#### Methods
- `createInvoice` - Creates a lightning invoice
- `decodeInvoice` - Decodes a lightning invoice by `bolt11` invoice string
- `registerInvoiceHash` - Stores an invoice hash in `redis`
- `verifyInvoiceHash` - Confirms an invoice hash exists in the `redis` db, without surpassing the [`invoiceVerificationTimeout`](lib/constants.ts) TTL
- `registerInvoiceWithSchema` - Registers a lightning invoice with an encoded Zod data schema. Optionally stores the invoice hash with `registerInvoiceHash` if configured.
- `verifyInvoiceWithSchema` - Decodes and parses an invoice from a `bolt11` invoice, parses the zod schema data included in the invoice description, and verifies that it exists in redis if configured.