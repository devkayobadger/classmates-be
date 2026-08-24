import { BadRequestError, NotFoundError } from '../../shared/ApiError.js'
import { findSubjectById } from '../subjects/subjects.repository.js'
import {
  countEnteredStatusesByAssignment,
  countStudentsByAssignment,
  createAssignment as createAssignmentRecord,
  deleteAssignment as deleteAssignmentRecord,
  findAssignmentById,
  findAssignmentStudents,
  findAssignmentsByTeacher,
  updateAssignment as updateAssignmentRecord,
  upsertAssignmentStatus,
} from './assignments.repository.js'
import type {
  AssignmentListFilters,
  AssignmentStatusesResponse,
  AssignmentRecord,
  AssignmentResponse,
  AssignmentStatus,
  CreateAssignmentRequest,
  SaveAssignmentStatusesRequest,
  UpdateAssignmentRequest,
} from './assignments.types.js'

const getStatus = (entered: number, total: number): AssignmentStatus => {
  if (entered === 0) return 'not-started'
  if (entered === total) return 'statuses-entered'
  return 'in-progress'
}

const toAssignmentResponse = async (
  assignment: AssignmentRecord,
  subject: { name: string; code: string },
): Promise<AssignmentResponse> => {
  const [studentCount, enteredCount] = await Promise.all([
    countStudentsByAssignment(assignment.id),
    countEnteredStatusesByAssignment(assignment.id),
  ])

  return {
    ...assignment,
    subjectName: subject.name,
    subjectCode: subject.code,
    createdAt: assignment.createdAt.toISOString(),
    updatedAt: assignment.updatedAt.toISOString(),
    studentCount,
    enteredCount,
    status: getStatus(enteredCount, studentCount),
  }
}

const getOwnedAssignment = async (id: string, teacherId: string): Promise<AssignmentRecord> => {
  const assignment = await findAssignmentById(id)
  if (!assignment) throw new NotFoundError('Assignment')
  if (!(await findSubjectById(assignment.subjectId, teacherId)))
    throw new NotFoundError('Assignment')
  return assignment
}

export const createAssignment = async (
  teacherId: string,
  data: CreateAssignmentRequest,
): Promise<AssignmentResponse> => {
  const subject = await findSubjectById(data.subjectId, teacherId)
  if (!subject) throw new NotFoundError('Subject')
  if (data.dueDate < data.assignedDate)
    throw new BadRequestError('Due date cannot be before assigned date')

  return toAssignmentResponse(await createAssignmentRecord(data), subject)
}

export const listAssignments = async (
  teacherId: string,
  filters: AssignmentListFilters,
): Promise<AssignmentResponse[]> => {
  const assignments = await findAssignmentsByTeacher(teacherId, filters)
  const responses = await Promise.all(
    assignments.map((assignment) =>
      toAssignmentResponse(assignment, {
        name: assignment.subjectName,
        code: assignment.subjectCode,
      }),
    ),
  )
  return filters.status
    ? responses.filter((assignment) => assignment.status === filters.status)
    : responses
}

export const getAssignment = async (id: string, teacherId: string): Promise<AssignmentResponse> => {
  const assignment = await getOwnedAssignment(id, teacherId)
  const subject = await findSubjectById(assignment.subjectId, teacherId)
  if (!subject) throw new NotFoundError('Assignment')
  return toAssignmentResponse(assignment, subject)
}

export const updateAssignment = async (
  id: string,
  teacherId: string,
  data: UpdateAssignmentRequest,
): Promise<AssignmentResponse> => {
  const existing = await getOwnedAssignment(id, teacherId)
  const subject = await findSubjectById(data.subjectId ?? existing.subjectId, teacherId)
  if (!subject) throw new NotFoundError('Subject')

  const assignedDate = data.assignedDate ?? existing.assignedDate
  const dueDate = data.dueDate ?? existing.dueDate
  if (dueDate < assignedDate) throw new BadRequestError('Due date cannot be before assigned date')
  if (
    data.subjectId &&
    data.subjectId !== existing.subjectId &&
    (await countEnteredStatusesByAssignment(id)) > 0
  ) {
    throw new BadRequestError('Cannot change the subject after student statuses have been entered')
  }

  const updated = await updateAssignmentRecord(id, data)
  if (!updated) throw new NotFoundError('Assignment')
  return toAssignmentResponse(updated, subject)
}

export const deleteAssignment = async (id: string, teacherId: string): Promise<void> => {
  await getOwnedAssignment(id, teacherId)
  if (!(await deleteAssignmentRecord(id))) throw new NotFoundError('Assignment')
}

export const getAssignmentStatuses = async (
  id: string,
  teacherId: string,
): Promise<AssignmentStatusesResponse> => {
  const assignment = await getOwnedAssignment(id, teacherId)
  const subject = await findSubjectById(assignment.subjectId, teacherId)
  if (!subject) throw new NotFoundError('Assignment')

  const students = await findAssignmentStudents(id)

  const studentsWithDefaultStatus = students.map((student) => ({
    ...student,
    status: student.status || 'done',
  }))

  return {
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    assignedDate: assignment.assignedDate,
    dueDate: assignment.dueDate,
    subject: subject.name,
    subjectCode: subject.code,
    program: subject.program,
    semester: String(subject.semester),
    students: studentsWithDefaultStatus,
  }
}

export const saveAssignmentStatuses = async (
  id: string,
  teacherId: string,
  data: SaveAssignmentStatusesRequest,
): Promise<void> => {
  await getOwnedAssignment(id, teacherId)
  const enrolledStudentIds = new Set(
    (await findAssignmentStudents(id)).map((student) => student.id),
  )
  const seenStudentIds = new Set<string>()

  for (const entry of data.statuses) {
    if (!enrolledStudentIds.has(entry.studentId)) {
      throw new BadRequestError('A student is not enrolled in this assignment subject')
    }
    if (seenStudentIds.has(entry.studentId))
      throw new BadRequestError('Each student can only be submitted once')
    seenStudentIds.add(entry.studentId)
  }

  await Promise.all(
    data.statuses.map((entry) => upsertAssignmentStatus(id, entry.studentId, entry.status)),
  )
}
