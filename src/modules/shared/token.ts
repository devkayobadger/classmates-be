import { generateAccessToken, generateRefreshToken } from "../../config/jwt"

export const generateTokens = (userId: string) => {
  const accessToken = generateAccessToken(userId)
  const refreshToken = generateRefreshToken(userId)
  return { accessToken, refreshToken }
}
