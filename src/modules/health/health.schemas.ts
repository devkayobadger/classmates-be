import { z } from 'zod'

import { registry } from '../../lib/openapi/registry.js'

export const HealthSchema = registry.register(
  'Health',
  z.object({
    status: z.literal('ok'),
    timestamp: z.number(),
  }),
)
