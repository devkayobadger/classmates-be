import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http'
import { drizzle as drizzleNode, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { env } from '../config/env.js'
import { logger } from '../config/logger.js'
import * as schema from './schema/index.js'

const isProduction = env.NODE_ENV === 'production'

let pool: Pool | null = null

const db = isProduction
  ? drizzleHttp(neon(env.DATABASE_URL), { schema })
  : (() => {
      pool = new Pool({
        connectionString: env.DATABASE_URL,
        max: 5,
      })

      return drizzleNode(pool, { schema }) as NodePgDatabase<typeof schema>
    })()

export const getDb = () => db

export const connectDB = async () => {
  try {
    if (isProduction) {
      await neon(env.DATABASE_URL)`SELECT 1`
    } else if (pool) {
      await pool.query('SELECT 1')
    }

    logger.info(`Drizzle connected to ${isProduction ? 'Neon PostgreSQL' : 'local PostgreSQL'}`)
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Unknown database error')

    logger.error({ err: error }, 'Database Connection Error')

    throw error
  }
}

export const checkDB = async () => {
  try {
    if (isProduction) {
      await neon(env.DATABASE_URL)`SELECT 1`
    } else if (pool) {
      await pool.query('SELECT 1')
    }

    return true
  } catch {
    return false
  }
}

export const closeDB = async () => {
  if (pool) {
    await pool.end()
    pool = null
  }

  // Neon HTTP does not require an explicit connection close.
}
