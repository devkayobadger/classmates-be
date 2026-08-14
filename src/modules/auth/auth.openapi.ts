import { registerRoute } from '../../lib/openapi/route.js'

import {
  LoginSchema,
  RefreshSchema,
  SignupSchema,
  TokenPairSchema,
  MeResponseSchema,
} from './auth.schemas.js'

import { ErrorSchema, MessageSchema, ValidationErrorSchema } from '../../lib/openapi/schemas.js'

// --------------------
// Signup
// --------------------

registerRoute({
  method: 'post',
  path: '/auth/signup',
  tag: 'Auth',
  summary: 'Create a new user account',

  body: SignupSchema,

  responses: {
    201: {
      description: 'Signup successful',
      schema: TokenPairSchema,
    },

    400: {
      description: 'Validation failed',
      schema: ValidationErrorSchema,
    },

    409: {
      description: 'Email already registered',
      schema: ErrorSchema,
    },
  },
})

// --------------------
// Login
// --------------------

registerRoute({
  method: 'post',
  path: '/auth/login',
  tag: 'Auth',
  summary: 'Authenticate user',

  body: LoginSchema,

  responses: {
    200: {
      description: 'Login successful',
      schema: TokenPairSchema,
    },

    400: {
      description: 'Validation failed',
      schema: ValidationErrorSchema,
    },

    401: {
      description: 'Invalid credentials',
      schema: ErrorSchema,
    },
  },
})

// --------------------
// Refresh Token
// --------------------

registerRoute({
  method: 'post',
  path: '/auth/refresh',
  tag: 'Auth',
  summary: 'Refresh access token',

  body: RefreshSchema,

  responses: {
    200: {
      description: 'Token refreshed successfully',
      schema: TokenPairSchema,
    },

    401: {
      description: 'Invalid or expired refresh token',
      schema: ErrorSchema,
    },
  },
})

// --------------------
// Logout
// --------------------

registerRoute({
  method: 'post',
  path: '/auth/logout',
  tag: 'Auth',
  summary: 'Logout current user',

  auth: true,

  responses: {
    200: {
      description: 'Logged out successfully',
      schema: MessageSchema,
    },

    401: {
      description: 'Authentication credentials were not provided',
      schema: ErrorSchema,
    },
  },
})

// --------------------
// Current User
// --------------------

registerRoute({
  method: 'get',
  path: '/auth/me',
  tag: 'Auth',
  summary: 'Get current authenticated user',

  auth: true,

  responses: {
    200: {
      description: 'Current authenticated user retrieved successfully',
      schema: MeResponseSchema,
    },

    401: {
      description: 'Authentication credentials were not provided',
      schema: ErrorSchema,
    },

    404: {
      description: 'User not found',
      schema: ErrorSchema,
    },
  },
})
