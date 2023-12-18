{
  description = "LNGPT";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; };
      in {
        devShells = {
          default = pkgs.mkShell {
            nativeBuildInputs = [ pkgs.bun pkgs.nodejs_20 pkgs.starship ];
            shellHook = ''
              bun install
              if ! docker info > /dev/null 2>&1; then
                echo "Docker daemon is not running. Please start Docker and try again.";
                exit 1;
              fi
              docker-compose up -d
              bun db:update
              clear
              eval "$(starship init bash)"
            '';
          };
        };
      });
}
