{
  description = "Fedi Mod Boilerplate";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { 
        inherit system; 
        config.allowUnfree = true;
      };
      in {
        devShells = {
          default = pkgs.mkShell {
            nativeBuildInputs = [ pkgs.bun pkgs.nodejs_20 pkgs.mprocs pkgs.ngrok pkgs.docker ];
          };
        };
      });
}
