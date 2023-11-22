{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }: {
    devShells.default = with nixpkgs.legacyPackages.x86_64-linux; mkShell {
      buildInputs = [ postgresql just bun ];
      # Add other dependencies or settings if needed
    };
  };
}
