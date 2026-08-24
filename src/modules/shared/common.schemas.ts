import { z } from 'zod'
import { registry } from '../../lib/openapi/registry'


export const IdParamSchema = registry.register(
  'IdParam',
  z.object({
    id: z.string().uuid(),
  }),
)
