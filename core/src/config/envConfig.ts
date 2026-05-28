import dotenv from "dotenv";
import path from "node:path";
import * as z from "zod";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  HOST: z.string().min(1).default("0.0.0.0"),

  PORT: z.coerce.number().int().positive().default(5002),

  CORS_ORIGIN: z.preprocess((val) => {
    if (typeof val === "string") return val.split(",").map((url) => url.trim());
    return val;
  }, z.array(z.url())),
  REDIS_URL: z.url().default("redis://:mypassword@localhost:6379"),
  DATABASE_URL: z.url(),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .positive()
    .default(1000),

  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),
  MIDTRANS_SERVER_KEY: z.string(),
  MIDTRANS_CLIENT_KEY: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === "development",
  isProduction: parsedEnv.data.NODE_ENV === "production",
  isTest: parsedEnv.data.NODE_ENV === "test",
};
