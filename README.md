# Fedi Mod Boilerplate

A template for building Fedi Mods with on-brand UI and Lightning/Nostr utilities over [Alby](https://getalby.com) and [`@nostr-dev-kit/ndk`](https://www.npmjs.com/package/@nostr-dev-kit/ndk).

## Documentation

- [Components](/docs/components.md)
- [UI Guidelines & Units](/docs/ui.md)
- [Lightning Utilities](/docs/lightning.md)

## Environment Variables

`POSTGRES_PRISMA_URL` - A postgresql database URI. Required for lightning utilities.
`LIGHTNING_ADDRESS` - A lightning address (only [mutinynet.app](https://mutinynet.app) and [alby](https://getalby.com) address supported at the moment). Required for using lightning address utils.
`BTC_NETWORK` - one of `mainnet` or `mutinynet`. Defaults to `mainnet`.

## Development

1. Install packages with `bun install`
2. Set the `POSTGRES_PRISMA_URL` environment variable to a valid postgres URI
3. Initialize database migrations with `bun prisma migrate dev`
4. Generate types with `bun prisma generate`
5. Run the development server with `bun run dev`

## Deployment

1. Build the mod with `bun run build`
2. Start the production server with `bun run start`