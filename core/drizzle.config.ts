import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/envConfig";

export default defineConfig({
  out: "./src/platform/drizzle/migrations",
  schema: "./src/platform/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
