import { ConflictError, NotFoundError, UnauthorizedError } from '../../shared/ApiError.js'
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserRefreshToken,
} from '../users/user.repository.js'
import {
  AuthResponse,
  LoginRequest,
  RefreshRequest,
  SignupRequest,
  UpdateProfileRequest,
  UserResponse,
} from './auth.types.js'
import { MESSAGES } from '../../constants/messages.js'
import { comparePassword, hashPassword } from '../../shared/hash.js'
import { compareRefreshToken, hashRefreshToken } from '../../shared/refreshToken.js'
import { generateTokens } from '../../shared/token.js'
import { getUserProfile, updateUserProfile } from '../users/user.service.js'
import { verifyRefreshToken } from '../../config/jwt.js'

export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const { name, email, password } = data

  // Check if user already exists
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    throw new ConflictError(MESSAGES.EMAIL_ALREADY_REGISTERED)
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  })

  // Generate access and refresh tokens
  const tokens = generateTokens(user.id)

  await updateUserRefreshToken(user.id, hashRefreshToken(tokens.refreshToken))

  return tokens
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const { email, password } = data

  // Find user by email
  const user = await findUserByEmail(email)
  if (!user) {
    throw new UnauthorizedError(MESSAGES.INVALID_CREDENTIALS)
  }

  // Verify password
  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) {
    throw new UnauthorizedError(MESSAGES.INVALID_CREDENTIALS)
  }

  // Generate new tokens
  const tokens = generateTokens(user.id)

  await updateUserRefreshToken(user.id, hashRefreshToken(tokens.refreshToken))

  return tokens
}

export const refreshToken = async (data: RefreshRequest) => {
  const oldToken = data.refreshToken

  if (!oldToken) {
    throw new UnauthorizedError(MESSAGES.REFRESH_TOKEN_MISSING)
  }

  let payload: { userId: string }
  try {
    payload = verifyRefreshToken(oldToken)
  } catch {
    throw new UnauthorizedError(MESSAGES.INVALID_REFRESH_TOKEN)
  }

  const user = await findUserById(payload.userId)
  if (!user?.refreshToken || !compareRefreshToken(oldToken, user.refreshToken)) {
    throw new UnauthorizedError(MESSAGES.INVALID_REFRESH_TOKEN)
  }

  // Generate new tokens
  const tokens = generateTokens(user.id)

  await updateUserRefreshToken(user.id, hashRefreshToken(tokens.refreshToken))

  return tokens
}

export const logout = async (userId: string) => {
  const user = await findUserById(userId)

  if (!user) {
    throw new NotFoundError('User')
  }

  // Remove refresh token
  await updateUserRefreshToken(user.id, null)

  return { message: 'Logged out successfully' }
}

export const getMe = async (userId: string): Promise<UserResponse> => {
  return getUserProfile(userId)
}

export const updateMe = async (
  userId: string,
  data: UpdateProfileRequest,
): Promise<UserResponse> => {
  return updateUserProfile(userId, data)
}
