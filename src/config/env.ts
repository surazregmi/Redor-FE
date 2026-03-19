import { z } from "zod";

const envSchema = z.object({
  API_BASE_URL: z.string().url(),
  APP_NAME: z.string(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error("❌ Invalid env variables", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = {
  API_BASE_URL: parsed.data.API_BASE_URL,
  APP_NAME: parsed.data.APP_NAME,
  IS_DEV: import.meta.env.MODE === "development",
};
