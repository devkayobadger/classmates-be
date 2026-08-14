import { z } from 'zod'

import { registry } from './registry.js'

// Common Responses
export const MessageSchema = registry.register(
  'Message',
  z.object({
    detail: z.string(),
  }),
)

// Common Errors
export const ErrorSchema = registry.register(
  'Error',
  z.object({
    detail: z.string(),
  }),
)

export const ValidationErrorSchema = registry.register(
  'ValidationError',
  z.record(z.string(), z.array(z.string())),
)

// Pagination
export const PaginationSchema = registry.register(
  'Pagination',
  z.object({
    count: z.number().int().nonnegative(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
  }),
)

export const paginatedSchema = <T extends z.ZodTypeAny>(name: string, schema: T) =>
  registry.register(
    name,
    z.object({
      count: z.number().int().nonnegative(),
      next: z.string().nullable(),
      previous: z.string().nullable(),
      results: z.array(schema),
    }),
  )
