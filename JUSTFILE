set dotenv-load := true

dev:
  mprocs

build:
  bun run build

lint:
  bun run lint

reset db:
  docker-compose down -v && docker-compose up -d
