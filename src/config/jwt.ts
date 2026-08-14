import jwt from 'jsonwebtoken'

import { env } from './env.js'

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_ACCESS, { expiresIn: '30m' })
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_REFRESH, { expiresIn: '7d' })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS) as { userId: string }
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH) as { userId: string }
}
