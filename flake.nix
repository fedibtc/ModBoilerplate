{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }: {
    devShells = {
      aarch64-darwin = with nixpkgs.legacyPackages.aarch64-darwin; mkShell {
        buildInputs = [ postgresql just bun ];
        # Add other dependencies or settings if needed for Darwin
      };
      x86_64-linux = with nixpkgs.legacyPackages.x86_64-linux; mkShell {
        buildInputs = [ postgresql just bun ];
        # Add other dependencies or settings if needed for Linux
      };
    };
  };
}
