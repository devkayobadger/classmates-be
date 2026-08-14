import cookieParser from 'cookie-parser'
import express from 'express'

import docsRouter from './docs.js'
import routes from './routes.js'
import { NotFoundError } from './shared/ApiError.js'
import { corsMiddleware, generalRateLimiter, helmetMiddleware } from './config/security.js'
import { env } from './config/env.js'
import { errorMiddleware } from './middlewares/error.middleware.js'

const app = express()

app.set('trust proxy', 1)

app.use(helmetMiddleware)

app.use(corsMiddleware)

app.use(generalRateLimiter)

app.use(express.json({ limit: '100kb' }))

app.use(cookieParser())

// OpenAPI JSON + Swagger UI
app.use('/api', docsRouter)

// API
app.use(env.API_PREFIX, routes)

// 404
app.use((_req, _res, next) => {
  next(new NotFoundError('Route'))
})

// Error handler
app.use(errorMiddleware)

export default app
