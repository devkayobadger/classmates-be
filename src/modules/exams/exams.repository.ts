import { randomUUID } from 'node:crypto'

import { and, eq, sql } from 'drizzle-orm'

import { getDb } from '../../db/index.js'
import { enrollments, examMarks, exams, students, subjects } from '../../db/schema/index.js'
import type { ExamRecord, ExamStudentMark } from './exams.types.js'
import { DEFAULT_EXAMS } from './exams.defaults.js'

const toExamRecord = (exam: typeof exams.$inferSelect): ExamRecord => ({
  id: exam.id,
  subjectId: exam.subjectId,
  type: exam.type,
  title: exam.title,
  totalMarks: exam.totalMarks,
  examDate: exam.examDate,
  createdAt: exam.createdAt,
  updatedAt: exam.updatedAt,
})

export const createExam = async (data: {
  subjectId: string
  type: ExamRecord['type']
  title: string
  totalMarks: number
  examDate?: string | null
}): Promise<ExamRecord> => {
  const [exam] = await getDb()
    .insert(exams)
    .values({
      id: randomUUID(),
      ...data,
    })
    .returning()

  return toExamRecord(exam)
}

export const createDefaultExams = async (subjectId: string): Promise<ExamRecord[]> => {
  const values = DEFAULT_EXAMS.map((exam) => ({
    id: randomUUID(),
    subjectId,
    type: exam.type,
    title: exam.title,
    totalMarks: exam.totalMarks,
    examDate: null,
  }))

  const rows = await getDb().insert(exams).values(values).returning()

  return rows.map(toExamRecord)
}

export const findExamById = async (id: string): Promise<ExamRecord | null> => {
  const [exam] = await getDb().select().from(exams).where(eq(exams.id, id)).limit(1)

  return exam ? toExamRecord(exam) : null
}

export const findExamsByTeacher = async (teacherId: string): Promise<ExamRecord[]> => {
  const rows = await getDb()
    .select({
      exam: exams,
    })
    .from(exams)
    .innerJoin(subjects, eq(exams.subjectId, subjects.id))
    .where(eq(subjects.teacherId, teacherId))

  return rows.map((row) => toExamRecord(row.exam))
}

export const countStudentsByExam = async (examId: string): Promise<number> => {
  const [result] = await getDb()
    .select({
      count: sql<number>`count(*)`,
    })
    .from(exams)
    .innerJoin(enrollments, eq(enrollments.subjectId, exams.subjectId))
    .where(eq(exams.id, examId))

  return Number(result?.count ?? 0)
}

export const countEnteredMarksByExam = async (examId: string): Promise<number> => {
  const [result] = await getDb()
    .select({
      count: sql<number>`count(*)`,
    })
    .from(examMarks)
    .where(eq(examMarks.examId, examId))

  return Number(result?.count ?? 0)
}

export const findExamStudents = async (examId: string): Promise<ExamStudentMark[]> => {
  const rows = await getDb()
    .select({
      id: students.id,
      name: students.name,
      rollNumber: students.rollNumber,
      studentCode: students.registrationNo,
      marks: examMarks.marks,
    })
    .from(exams)
    .innerJoin(enrollments, eq(enrollments.subjectId, exams.subjectId))
    .innerJoin(students, eq(students.id, enrollments.studentId))
    .leftJoin(examMarks, and(eq(examMarks.examId, exams.id), eq(examMarks.studentId, students.id)))
    .where(eq(exams.id, examId))

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    rollNumber: row.rollNumber,
    studentCode: row.studentCode,
    marks: row.marks,
  }))
}

export const upsertExamMark = async (
  examId: string,
  studentId: string,
  marks: number,
): Promise<void> => {
  await getDb()
    .insert(examMarks)
    .values({
      id: randomUUID(),
      examId,
      studentId,
      marks,
    })
    .onConflictDoUpdate({
      target: [examMarks.examId, examMarks.studentId],
      set: {
        marks,
        updatedAt: new Date(),
      },
    })
}
