import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string(),
  POSTGRES_PRISMA_URL: z.string(),
  BASE_URL: z.string().url(),
  PASSWORD: z.string(),
  FEDERATION_ID: z
    .string()
    .min(48)
    .max(192)
    .regex(/[a-f0-9]+/),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_ENV: z.enum(["development", "preview", "production"]),
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
