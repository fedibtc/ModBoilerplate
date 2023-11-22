{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }: {
    devShells.default = pkgs.mkShell {
      buildInputs = [ pkgs.postgresql pkgs.just pkgs.bun ];
      # Add other dependencies here
    };
  };
}