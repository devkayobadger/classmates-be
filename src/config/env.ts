import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  API_PREFIX: z.string().default('/api/v1'),
  JWT_ACCESS: z.string().min(16, 'JWT_ACCESS must be at least 16 characters'),
  JWT_REFRESH: z.string().min(16, 'JWT_REFRESH must be at least 16 characters'),
  CORS_ORIGIN: z.string().optional(),
  LOG_LEVEL: z.string().default('info'),
  RUN_MIGRATIONS: z.coerce.boolean().default(true),
})

const parsedEnv = EnvSchema.safeParse(process.env)

if (!parsedEnv.success) {
  const errors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ')

  throw new Error(`Invalid environment: ${errors}`)
}

export const env = parsedEnv.data

export const corsOrigins =
  env.CORS_ORIGIN?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? []
