import app from './app.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'
import { closeDB, connectDB } from './db/index.js'

const startServer = async () => {
  try {
    await connectDB()
  } catch (err) {
    logger.error({ err }, 'Failed to connect to database, exiting')
    process.exit(1)
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`)
  })

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down server')

    server.close(async () => {
      await closeDB()
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM')
  })

  process.on('SIGINT', () => {
    void shutdown('SIGINT')
  })
}

void startServer()
