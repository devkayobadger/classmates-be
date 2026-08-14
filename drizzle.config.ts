import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required')
}

const connectionUrl =
  process.env.NODE_ENV === 'development'
    ? databaseUrl.replace('@postgres:5432', '@localhost:5433')
    : databaseUrl

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema',
  out: './drizzle',
  dbCredentials: {
    url: connectionUrl,
  },
  verbose: true,
  strict: true,
})
