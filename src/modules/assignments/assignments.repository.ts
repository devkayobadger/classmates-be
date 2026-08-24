import { randomUUID } from 'node:crypto'

import { and, asc, eq, ilike, or, sql } from 'drizzle-orm'

import { getDb } from '../../db/index.js'
import {
  assignmentMarks,
  assignments,
  enrollments,
  students,
  subjects,
} from '../../db/schema/index.js'
import type {
  AssignmentListFilters,
  AssignmentRecord,
  AssignmentCompletionStatus,
  AssignmentStudentStatus,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from './assignments.types.js'

const toAssignmentRecord = (assignment: typeof assignments.$inferSelect): AssignmentRecord => ({
  id: assignment.id,
  subjectId: assignment.subjectId,
  title: assignment.title,
  description: assignment.description,
  assignedDate: assignment.assignedDate,
  dueDate: assignment.dueDate,
  createdAt: assignment.createdAt,
  updatedAt: assignment.updatedAt,
})

export const createAssignment = async (
  data: CreateAssignmentRequest,
): Promise<AssignmentRecord> => {
  const [assignment] = await getDb()
    .insert(assignments)
    .values({ id: randomUUID(), ...data, description: data.description ?? null })
    .returning()
  return toAssignmentRecord(assignment)
}

export const findAssignmentById = async (id: string): Promise<AssignmentRecord | null> => {
  const [assignment] = await getDb()
    .select()
    .from(assignments)
    .where(eq(assignments.id, id))
    .limit(1)
  return assignment ? toAssignmentRecord(assignment) : null
}

export const findAssignmentsByTeacher = async (
  teacherId: string,
  filters: AssignmentListFilters,
): Promise<Array<AssignmentRecord & { subjectName: string; subjectCode: string }>> => {
  const conditions = [eq(subjects.teacherId, teacherId)]
  if (filters.subjectId) conditions.push(eq(assignments.subjectId, filters.subjectId))
  if (filters.search) {
    const term = `%${filters.search}%`
    conditions.push(
      or(
        ilike(assignments.title, term),
        ilike(assignments.description, term),
        ilike(subjects.name, term),
      )!,
    )
  }

  const rows = await getDb()
    .select({ assignment: assignments, subjectName: subjects.name, subjectCode: subjects.code })
    .from(assignments)
    .innerJoin(subjects, eq(assignments.subjectId, subjects.id))
    .where(and(...conditions))
    .orderBy(asc(assignments.dueDate), asc(assignments.title))

  return rows.map(({ assignment, subjectName, subjectCode }) => ({
    ...toAssignmentRecord(assignment),
    subjectName,
    subjectCode,
  }))
}

export const updateAssignment = async (
  id: string,
  data: UpdateAssignmentRequest,
): Promise<AssignmentRecord | null> => {
  const [assignment] = await getDb()
    .update(assignments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(assignments.id, id))
    .returning()
  return assignment ? toAssignmentRecord(assignment) : null
}

export const deleteAssignment = async (id: string): Promise<boolean> => {
  const deleted = await getDb().delete(assignments).where(eq(assignments.id, id)).returning()
  return deleted.length > 0
}

export const countStudentsByAssignment = async (assignmentId: string): Promise<number> => {
  const [result] = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(assignments)
    .innerJoin(enrollments, eq(enrollments.subjectId, assignments.subjectId))
    .where(eq(assignments.id, assignmentId))
  return Number(result?.count ?? 0)
}

export const countEnteredStatusesByAssignment = async (assignmentId: string): Promise<number> => {
  const [result] = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(assignmentMarks)
    .where(eq(assignmentMarks.assignmentId, assignmentId))
  return Number(result?.count ?? 0)
}

export const findAssignmentStudents = async (assignmentId: string): Promise<AssignmentStudentStatus[]> => {
  const rows = await getDb()
    .select({
      id: students.id,
      name: students.name,
      rollNumber: students.rollNumber,
      studentCode: students.registrationNo,
      status: assignmentMarks.status,
    })
    .from(assignments)
    .innerJoin(enrollments, eq(enrollments.subjectId, assignments.subjectId))
    .innerJoin(students, eq(students.id, enrollments.studentId))
    .leftJoin(
      assignmentMarks,
      and(
        eq(assignmentMarks.assignmentId, assignments.id),
        eq(assignmentMarks.studentId, students.id),
      ),
    )
    .where(eq(assignments.id, assignmentId))
    .orderBy(students.name)
  
  return rows.map((row) => ({
    ...row,
    status: row.status as AssignmentCompletionStatus | null,
  })) as AssignmentStudentStatus[]
}

export const upsertAssignmentStatus = async (
  assignmentId: string,
  studentId: string,
  status: AssignmentCompletionStatus,
): Promise<void> => {
  const normalizedStatus = status === 'late' ? 'late_done' : status

  await getDb()
    .insert(assignmentMarks)
    .values({ id: randomUUID(), assignmentId, studentId, status: normalizedStatus as any })
    .onConflictDoUpdate({
      target: [assignmentMarks.assignmentId, assignmentMarks.studentId],
      set: { status: normalizedStatus as any, updatedAt: new Date() },
    })
}
