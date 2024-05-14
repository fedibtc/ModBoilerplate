import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Client } from "pg"
import * as schema from "./schema"

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

await client.connect()

const db = drizzle(client, { schema })

await migrate(db, { migrationsFolder: "drizzle" })

process.exit(0)
