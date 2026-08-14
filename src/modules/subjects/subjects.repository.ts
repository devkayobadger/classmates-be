import { randomUUID } from 'node:crypto'

import { and, eq } from 'drizzle-orm'

import { getDb } from '../../db/index.js'
import { subjects } from '../../db/schema/index.js'
import type { SubjectRecord } from './subjects.types.js'

const toSubjectRecord = (subject: typeof subjects.$inferSelect): SubjectRecord => ({
  id: subject.id,
  name: subject.name,
  code: subject.code,
  semester: subject.semester,
  program: subject.program,
  color: subject.color,
  teacherId: subject.teacherId,
  createdAt: subject.createdAt,
  updatedAt: subject.updatedAt,
})

export const createSubject = async (data: {
  name: string
  code: string
  semester: number
  program?: string
  color?: string
  teacherId: string
}): Promise<SubjectRecord> => {
  const [subject] = await getDb()
    .insert(subjects)
    .values({ id: randomUUID(), ...data })
    .returning()

  return toSubjectRecord(subject)
}

export const findSubjectsByTeacher = async (teacherId: string): Promise<SubjectRecord[]> => {
  const rows = await getDb().select().from(subjects).where(eq(subjects.teacherId, teacherId))

  return rows.map(toSubjectRecord)
}

export const findSubjectByCode = async (code: string): Promise<SubjectRecord | null> => {
  const [subject] = await getDb().select().from(subjects).where(eq(subjects.code, code)).limit(1)

  return subject ? toSubjectRecord(subject) : null
}

export const findSubjectById = async (
  id: string,
  teacherId?: string,
): Promise<SubjectRecord | null> => {
  const [subject] = await getDb()
    .select()
    .from(subjects)
    .where(
      teacherId ? and(eq(subjects.id, id), eq(subjects.teacherId, teacherId)) : eq(subjects.id, id),
    )
    .limit(1)

  return subject ? toSubjectRecord(subject) : null
}

export const updateSubject = async (
  id: string,
  teacherId: string,
  data: Partial<{ name: string; code: string; semester: number; program: string; color: string }>,
): Promise<SubjectRecord | null> => {
  const [subject] = await getDb()
    .update(subjects)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(subjects.id, id), eq(subjects.teacherId, teacherId)))
    .returning()

  return subject ? toSubjectRecord(subject) : null
}

export const deleteSubject = async (id: string, teacherId: string): Promise<boolean> => {
  const result = await getDb()
    .delete(subjects)
    .where(and(eq(subjects.id, id), eq(subjects.teacherId, teacherId)))
    .returning()

  return result.length > 0
}
