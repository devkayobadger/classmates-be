import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'

import { registry } from './registry.js'

export default new OpenApiGeneratorV3(registry.definitions).generateDocument({
  openapi: '3.0.3',
  info: {
    title: 'Express API',
    version: '1.0.0',
  },
  servers: [{ url: '/api/v1' }],
})
