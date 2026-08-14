import { Router } from 'express'

import { authRateLimiter } from '../../config/security.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  loginController,
  logoutController,
  meController,
  refreshController,
  signupController,
  updateMeController,
} from './auth.controller.js'
import { LoginSchema, RefreshSchema, SignupSchema, UpdateProfileSchema } from './auth.schemas.js'

const router = Router()

// public routes
router.post('/signup', authRateLimiter, validate(SignupSchema), signupController)
router.post('/login', authRateLimiter, validate(LoginSchema), loginController)
router.post('/refresh', authRateLimiter, validate(RefreshSchema), refreshController)

// protected routes
router.post('/logout', authMiddleware, logoutController)
router.get('/me', authMiddleware, meController)
router.patch('/me', authMiddleware, validate(UpdateProfileSchema), updateMeController)

export default router
