import { defineConfig} from "drizzle-kit";

export default defineConfig({
    dialect: 'postgresql',
    schema: './server/database/schemas',
    out: './server/database/migrations',
    dbCredentials: {
        url: process.env.NUXT_POSTGRES_URL!,
    }
})