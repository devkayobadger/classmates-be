import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

import { corsOrigins, env } from './env.js'

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      // Swagger UI's CDN-hosted assets (see app.ts) need explicit allowance
      'script-src': ["'self'", 'https://cdnjs.cloudflare.com'],
      'style-src': ["'self'", 'https://cdnjs.cloudflare.com', "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https://cdnjs.cloudflare.com'],
    },
  },
})

export const corsMiddleware = cors({
  origin: corsOrigins.length > 0 ? corsOrigins : env.NODE_ENV === 'production' ? false : true,
  credentials: true,
})

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === 'production' ? 300 : 3000,
  standardHeaders: true,
  legacyHeaders: false,
})

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
})
