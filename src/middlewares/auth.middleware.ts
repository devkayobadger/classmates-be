import { NextFunction, Request, Response } from 'express'

import { verifyAccessToken } from '../config/jwt.js'
import { MESSAGES } from '../constants/messages.js'
import { UnauthorizedError } from '../shared/ApiError.js'

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError(MESSAGES.ACCESS_TOKEN_MISSING))
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyAccessToken(token)
    req.userId = payload.userId!
    next()
  } catch {
    return next(new UnauthorizedError(MESSAGES.INVALID_ACCESS_TOKEN))
  }
}
