import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_ENV: z.enum(["development", "preview", "production"]),
  FEDIMINT_CLIENTD_URL: z.string().url(),
  FEDIMINT_CLIENTD_PASSWORD: z.string(),
})

envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
