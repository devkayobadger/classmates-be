import request from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'

import type { Express } from 'express'

describe('app middleware', () => {
  let app: Express

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/express_js'
    process.env.JWT_ACCESS = 'test_access_secret_at_least_16_chars'
    process.env.JWT_REFRESH = 'test_refresh_secret_at_least_16_chars'
    process.env.LOG_LEVEL = 'silent'

    app = (await import('../src/app.js')).default
  }, 30000)

  it('sets security headers', async () => {
    const response = await request(app).get('/api/v1/health')

    expect(response.headers['x-content-type-options']).toBe('nosniff')
  })

  it('returns a standard 404 for unknown routes', async () => {
    const response = await request(app).get('/missing')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      success: false,
      message: 'Route not found',
    })
  })
})
