import { MESSAGES } from '../../constants/messages.js'
import { NotFoundError } from '../../shared/ApiError.js'
import { UserResponse } from '../auth/auth.types.js'
import { findUserById, updateUserProfile as updateUserProfileRecord } from './user.repository.js'
import type { UserRecord } from './user.types.js'

const toUserResponse = (
  user: Pick<UserRecord, 'id' | 'name' | 'email' | 'personalId' | 'createdAt' | 'updatedAt'>,
): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  personalId: user.personalId,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
})

export const getUserProfile = async (userId: string): Promise<UserResponse> => {
  const user = await findUserById(userId)

  if (!user) {
    throw new NotFoundError(MESSAGES.USER_NOT_FOUND)
  }

  return toUserResponse(user)
}

export const updateUserProfile = async (
  userId: string,
  data: Partial<{ name: string; personalId: string | null }>,
): Promise<UserResponse> => {
  const existing = await findUserById(userId)

  if (!existing) {
    throw new NotFoundError(MESSAGES.USER_NOT_FOUND)
  }

  const updated = await updateUserProfileRecord(userId, data)

  if (!updated) {
    throw new NotFoundError(MESSAGES.USER_NOT_FOUND)
  }

  return toUserResponse(updated)
}

export type { UserRecord } from './user.types.js'
