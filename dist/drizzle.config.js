import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
    schema: "./lib/db-schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.NEON_DATABASE_URL,
    },
});
//# sourceMappingURL=drizzle.config.js.map