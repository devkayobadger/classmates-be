import { randomUUID } from 'node:crypto'

import { eq } from 'drizzle-orm'

import { getDb } from '../../db/index.js'
import { users } from '../../db/schema/index.js'
import type { UserRecord } from './user.types.js'

const toUserRecord = (user: typeof users.$inferSelect): UserRecord => ({
  id: user.id,
  name: user.name,
  email: user.email,
  password: user.password,
  personalId: user.personalId,
  refreshToken: user.refreshToken,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

/** Emails are stored lowercase/trimmed, so every lookup normalizes the same way
 * regardless of how the caller typed it (mixed-case login, seed scripts, etc.). */
const normalizeEmail = (email: string): string => email.trim().toLowerCase()

export const findUserByEmail = async (email: string): Promise<UserRecord | null> => {
  const [user] = await getDb()
    .select()
    .from(users)
    .where(eq(users.email, normalizeEmail(email)))
    .limit(1)

  if (!user) return null

  return toUserRecord(user)
}

export const findUserById = async (id: string): Promise<UserRecord | null> => {
  const [user] = await getDb().select().from(users).where(eq(users.id, id)).limit(1)

  if (!user) return null

  return toUserRecord(user)
}

export const createUser = async (data: {
  name: string
  email: string
  password: string
}): Promise<UserRecord> => {
  const [user] = await getDb()
    .insert(users)
    .values({
      id: randomUUID(),
      name: data.name,
      email: normalizeEmail(data.email),
      password: data.password,
      refreshToken: null,
    })
    .returning()

  return toUserRecord(user)
}

export const updateUserProfile = async (
  id: string,
  data: Partial<{ name: string; personalId: string | null }>,
): Promise<UserRecord | null> => {
  const [user] = await getDb()
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning()

  if (!user) return null

  return toUserRecord(user)
}

export const updateUserRefreshToken = async (
  id: string,
  refreshToken: string | null,
): Promise<UserRecord | null> => {
  const [user] = await getDb()
    .update(users)
    .set({
      refreshToken,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning()

  if (!user) return null

  return toUserRecord(user)
}
