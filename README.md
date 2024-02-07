# Fedi Mod Boilerplate

A template for building Fedi Mods.

## Development

1. Clone the repository
   ```bash
   git clone https://github.com/fedibtc/ModBoilerplate.git
   ```
2. Ensure you have [Nix installed](https://nixos.org/download)
3. Open a shell and run `nix develop`
4. Run `just dev` to start the development server

## Production

1. Set the `POSTGRES_URL` environment variable to a production database if you're using it
2. Create a production build with `bun run build`
3. Server the build with `bun run start`

## Links

- [Documentation](https://fedibtc.github.io/fedi-docs/docs/mods/developers/intro)
- [Github](https://github.com/fedibtc/ModBoilerplate)
