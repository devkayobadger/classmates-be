import { registerRoute } from '../../lib/openapi/route.js'
import { HealthSchema } from './health.schemas.js'

registerRoute({
  method: 'get',
  path: '/health',
  tag: 'Health',
  summary: 'Health Check',

  responses: {
    200: {
      description: 'Server is healthy',
      schema: HealthSchema,
    },
  },
})
