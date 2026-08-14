import { z } from 'zod'

import { registry } from '../../lib/openapi/registry.js'

// Request Schemas
export const SignupSchema = registry.register(
  'SignupRequest',
  z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
  }),
)

export const LoginSchema = registry.register(
  'LoginRequest',
  z.object({
    email: z.email(),
    password: z.string(),
  }),
)

export const RefreshSchema = registry.register(
  'RefreshRequest',
  z.object({
    refreshToken: z.string(),
  }),
)

export const UpdateProfileSchema = registry.register(
  'UpdateProfileRequest',
  z.object({
    name: z.string().min(1).optional(),
    personalId: z.string().max(64).nullable().optional(),
  }),
)

// Response Schemas
export const TokenPairSchema = registry.register(
  'TokenPair',
  z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
)

export const UserSchema = registry.register(
  'User',
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    personalId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
)

export const MeResponseSchema = registry.register(
  'MeResponse',
  z.object({
    user: UserSchema,
  }),
)
