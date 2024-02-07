set dotenv-load := true

dev:
  mprocs

build:
  bun run build

start:
  bun run start

reset db:
  docker-compose down -v && docker-compose up -d
