import { randomUUID } from 'node:crypto'

import { and, eq } from 'drizzle-orm'

import { getDb } from '../../db/index.js'
import { enrollments, students, subjects } from '../../db/schema/index.js'
import type { EnrollmentRecord, EnrollmentWithStudent } from './enrollments.types.js'

const toEnrollmentRecord = (row: typeof enrollments.$inferSelect): EnrollmentRecord => ({
  id: row.id,
  studentId: row.studentId,
  subjectId: row.subjectId,
  internalMarks: row.internalMarks,
  internalMarksTotal: row.internalMarksTotal,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
})

export const createEnrollment = async (data: {
  studentId: string
  subjectId: string
}): Promise<EnrollmentRecord> => {
  const [row] = await getDb()
    .insert(enrollments)
    .values({ id: randomUUID(), ...data })
    .returning()

  return toEnrollmentRecord(row)
}

export const findEnrollmentById = async (id: string): Promise<EnrollmentRecord | null> => {
  const [row] = await getDb().select().from(enrollments).where(eq(enrollments.id, id)).limit(1)

  return row ? toEnrollmentRecord(row) : null
}

export const findEnrollmentByStudentSubject = async (
  studentId: string,
  subjectId: string,
): Promise<EnrollmentRecord | null> => {
  const [row] = await getDb()
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.subjectId, subjectId)))
    .limit(1)

  return row ? toEnrollmentRecord(row) : null
}

export const listEnrollmentsBySubject = async (
  subjectId: string,
): Promise<EnrollmentWithStudent[]> => {
  const rows = await getDb()
    .select({
      id: enrollments.id,
      studentId: enrollments.studentId,
      subjectId: enrollments.subjectId,
      internalMarks: enrollments.internalMarks,
      internalMarksTotal: enrollments.internalMarksTotal,
      createdAt: enrollments.createdAt,
      updatedAt: enrollments.updatedAt,
      student: {
        id: students.id,
        name: students.name,
        rollNumber: students.rollNumber,
        registrationNo: students.registrationNo,
        email: students.email,
        semester: students.semester,
      },
    })
    .from(enrollments)
    .innerJoin(students, eq(enrollments.studentId, students.id))
    .where(eq(enrollments.subjectId, subjectId))

  return rows
}

/** Counts distinct students enrolled across all subjects belonging to a teacher. */
export const countDistinctEnrolledStudentsForTeacher = async (
  teacherId: string,
): Promise<number> => {
  const rows = await getDb()
    .selectDistinct({ studentId: enrollments.studentId })
    .from(enrollments)
    .innerJoin(subjects, eq(enrollments.subjectId, subjects.id))
    .where(eq(subjects.teacherId, teacherId))

  return rows.length
}

export const updateEnrollment = async (
  id: string,
  data: Partial<{ internalMarks: number; internalMarksTotal: number }>,
): Promise<EnrollmentRecord | null> => {
  const [row] = await getDb()
    .update(enrollments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(enrollments.id, id))
    .returning()

  return row ? toEnrollmentRecord(row) : null
}

export const deleteEnrollment = async (id: string): Promise<boolean> => {
  const result = await getDb().delete(enrollments).where(eq(enrollments.id, id)).returning()

  return result.length > 0
}

export const countEnrollmentsBySubject = async (subjectId: string): Promise<number> => {
  const rows = await getDb()
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(eq(enrollments.subjectId, subjectId))

  return rows.length
}
