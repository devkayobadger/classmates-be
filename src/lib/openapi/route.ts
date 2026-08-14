import z from 'zod'

import { registry } from './registry.js'

type AnyObjectSchema = z.ZodObject<z.ZodRawShape>

type RouteOptions = {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  path: string

  tag: string
  summary: string

  body?: z.ZodTypeAny
  params?: AnyObjectSchema
  query?: AnyObjectSchema

  auth?: boolean

  responses: Record<
    number,
    {
      description: string
      schema: z.ZodTypeAny
    }
  >
}

export function registerRoute({
  method,
  path,
  tag,
  summary,
  body,
  params,
  query,
  auth,
  responses,
}: RouteOptions) {
  registry.registerPath({
    method,
    path,
    tags: [tag],
    summary,

    security: auth ? [{ bearerAuth: [] }] : undefined,

    request: {
      ...(body && {
        body: {
          content: {
            'application/json': {
              schema: body,
            },
          },
        },
      }),

      ...(params && { params }),

      ...(query && { query }),
    },

    responses: Object.fromEntries(
      Object.entries(responses).map(([status, value]) => [
        status,
        {
          description: value.description,
          content: {
            'application/json': {
              schema: value.schema,
            },
          },
        },
      ]),
    ),
  })
}
