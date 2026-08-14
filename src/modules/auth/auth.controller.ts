import { Request, Response } from 'express'

import { ApiResponse } from '../../shared/ApiResponse.js'
import { asyncHandler } from '../../shared/asyncHandler.js'
import { getMe, login, logout, refreshToken, signup, updateMe } from './auth.service.js'

// Public controllers
export const signupController = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await signup(req.body)

  ApiResponse.created(res, tokens)
})

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await login(req.body)

  ApiResponse.ok(res, tokens)
})

export const refreshController = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await refreshToken(req.body)

  ApiResponse.ok(res, tokens)
})

// Protected controllers
export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  await logout(req.userId)

  ApiResponse.deleted(res, 'Logged out successfully')
})

export const meController = asyncHandler(async (req: Request, res: Response) => {
  const user = await getMe(req.userId)

  ApiResponse.ok(res, {
    user,
  })
})

export const updateMeController = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateMe(req.userId, req.body)

  ApiResponse.updated(res, {
    user,
  })
})
