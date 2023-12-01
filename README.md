# Fedi Mod Boilerplate

A template for building Fedi Mods with on-brand UI and Lightning/Nostr utilities over [Alby](https://getalby.com) and [`@nostr-dev-kit/ndk`](https://www.npmjs.com/package/@nostr-dev-kit/ndk).

## Documentation

- [Components](/docs/components.md)
- [UI Guidelines & Units](/docs/ui.md)
- [Lightning Utilities](/docs/lightning.md)

## Environment Variables

Before running the development server, rename `.env.example` to `.env.local`.

- `LIGHTNING_ADDRESS` - A lightning address from either [mutinynet.app](https://mutinynet.app) or [alby](https://getalby.com)
- `BTC_NETWORK` - one of `mainnet` or `mutinynet`. Defaults to `mainnet` if not provided.
- `POSTGRES_URL` - A Postgres Database URI. Does not need to be configured in dev mode if docker is running.

## Development

1. Ensure a Docker Daemon is running
2. Run `nix develop`
3. Configure the `LIGHTNING_ADDRESS`, and `BTC_NETWORK` environment variables if you plan to use the lighting utilities.
4. Run the development server `bun run dev`

**Tip:** Run `bun prisma studio` to open up an interactive database admin on http://localhost:5555

## Production

1. Set the `POSTGRES_URL` environment variable to a production database if using lighting utilities.
2. Create a production build with `bun run build`
3. Server the build with `bun run start`
