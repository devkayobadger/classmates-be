import { z } from 'zod'

import { registry } from '../lib/openapi/registry.js'

export const IdParamSchema = registry.register(
  'IdParam',
  z.object({
    id: z.string().uuid(),
  }),
)
