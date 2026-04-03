import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.url(),
  VITE_APP_NAME: z.string().min(1),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.issues);
  throw new Error("Invalid environment variables. Check your .env file.");
}

export const env = {
  API_BASE_URL: parsed.data.VITE_API_BASE_URL,
  APP_NAME: parsed.data.VITE_APP_NAME,
  IS_DEV: import.meta.env.MODE === "development",
};
