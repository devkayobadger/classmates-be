import type { z } from 'zod'

import type {
  LoginSchema,
  MeResponseSchema,
  RefreshSchema,
  SignupSchema,
  TokenPairSchema,
  UpdateProfileSchema,
  UserSchema,
} from './auth.schemas.js'

// Request types
export type SignupRequest = z.infer<typeof SignupSchema>

export type LoginRequest = z.infer<typeof LoginSchema>

export type RefreshRequest = z.infer<typeof RefreshSchema>

export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>

// Response types
export type AuthResponse = z.infer<typeof TokenPairSchema>

export type UserResponse = z.infer<typeof UserSchema>

export type MeResponse = z.infer<typeof MeResponseSchema>

// Non-schema TypeScript-only types
export interface JwtPayload {
  userId: string
  email: string
}
