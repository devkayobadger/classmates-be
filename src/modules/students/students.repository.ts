import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { getDb } from '../../db/index.js'
import { students } from '../../db/schema/index.js'
import type { StudentRecord } from './students.types.js'

const toStudentRecord = (student: typeof students.$inferSelect): StudentRecord => ({
  id: student.id,
  name: student.name,
  rollNumber: student.rollNumber,
  registrationNo: student.registrationNo,
  email: student.email,
  semester: student.semester,
  createdAt: student.createdAt,
  updatedAt: student.updatedAt,
})

export const createStudent = async (data: {
  name: string
  rollNumber: string
  registrationNo: string
  email?: string
  semester: number
}): Promise<StudentRecord> => {
  const [student] = await getDb()
    .insert(students)
    .values({ id: randomUUID(), ...data, email: data.email ?? null })
    .returning()
  return toStudentRecord(student)
}

export const findAllStudents = async (): Promise<StudentRecord[]> => {
  const rows = await getDb().select().from(students)
  return rows.map(toStudentRecord)
}

export const findStudentById = async (id: string): Promise<StudentRecord | null> => {
  const [student] = await getDb().select().from(students).where(eq(students.id, id)).limit(1)
  return student ? toStudentRecord(student) : null
}

export const findStudentByRollNumber = async (
  rollNumber: string,
): Promise<StudentRecord | null> => {
  const [student] = await getDb()
    .select()
    .from(students)
    .where(eq(students.rollNumber, rollNumber))
    .limit(1)
  return student ? toStudentRecord(student) : null
}

export const findStudentByRegistrationNo = async (
  registrationNo: string,
): Promise<StudentRecord | null> => {
  const [student] = await getDb()
    .select()
    .from(students)
    .where(eq(students.registrationNo, registrationNo))
    .limit(1)
  return student ? toStudentRecord(student) : null
}

export const updateStudent = async (
  id: string,
  data: Partial<{
    name: string
    rollNumber: string
    registrationNo: string
    email: string | null
    semester: number
  }>,
): Promise<StudentRecord | null> => {
  const [student] = await getDb()
    .update(students)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(students.id, id))
    .returning()
  return student ? toStudentRecord(student) : null
}

export const deleteStudent = async (id: string): Promise<boolean> => {
  const result = await getDb().delete(students).where(eq(students.id, id)).returning()
  return result.length > 0
}
