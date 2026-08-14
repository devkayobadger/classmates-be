import { generateAccessToken, generateRefreshToken } from '../config/jwt.js'

export const generateTokens = (userId: string) => {
  const accessToken = generateAccessToken(userId)
  const refreshToken = generateRefreshToken(userId)
  return { accessToken, refreshToken }
}
