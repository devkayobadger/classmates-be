import { MESSAGES } from '../../constants/messages.js'
import { ForbiddenError, NotFoundError, ConflictError } from '../../shared/ApiError.js'
import { listAttendanceRecords } from '../attendance/attendance.repository.js'
import { countEnrollmentsBySubject } from '../enrollments/enrollments.repository.js'
import { createDefaultExamsForSubject } from '../exams/exams.service.js'
import {
  createSubject as createSubjectRecord,
  deleteSubject as deleteSubjectRecord,
  findSubjectByCode,
  findSubjectById,
  findSubjectsByTeacher,
  updateSubject as updateSubjectRecord,
} from './subjects.repository.js'
import type {
  CreateSubjectRequest,
  SubjectRecord,
  SubjectResponse,
  UpdateSubjectRequest,
} from './subjects.types.js'

const computeAttendancePercentage = async (
  subjectId: string,
  teacherId: string,
): Promise<number> => {
  const records = await listAttendanceRecords({ subjectId, teacherId })

  if (records.length === 0) return 0

  const presentCount = records.filter((r) => r.status === 'present').length

  return Math.round((presentCount / records.length) * 10000) / 100
}

const toSubjectResponse = async (
  subject: SubjectRecord,
  teacherId: string,
): Promise<SubjectResponse> => {
  const [studentCount, attendancePercentage] = await Promise.all([
    countEnrollmentsBySubject(subject.id),
    computeAttendancePercentage(subject.id, teacherId),
  ])

  return {
    id: subject.id,
    name: subject.name,
    code: subject.code,
    semester: subject.semester,
    program: subject.program,
    color: subject.color,
    teacherId: subject.teacherId,
    createdAt: subject.createdAt.toISOString(),
    updatedAt: subject.updatedAt.toISOString(),
    studentCount,
    attendancePercentage,
  }
}

export const createSubject = async (
  teacherId: string,
  data: CreateSubjectRequest,
): Promise<SubjectResponse> => {
  const existing = await findSubjectByCode(data.code)

  if (existing) {
    throw new ConflictError(MESSAGES.SUBJECT_CODE_ALREADY_REGISTERED)
  }
  const subject = await createSubjectRecord({
    ...data,
    teacherId,
  })
  await createDefaultExamsForSubject(subject.id)

  return toSubjectResponse(subject, teacherId)
}

export const listSubjects = async (teacherId: string): Promise<SubjectResponse[]> => {
  const subjects = await findSubjectsByTeacher(teacherId)

  return Promise.all(subjects.map((subject) => toSubjectResponse(subject, teacherId)))
}

export const getSubject = async (id: string, teacherId: string): Promise<SubjectResponse> => {
  const subject = await findSubjectById(id)

  if (!subject) {
    throw new NotFoundError('Subject')
  }

  if (subject.teacherId !== teacherId) {
    throw new ForbiddenError(MESSAGES.PERMISSION_DENIED)
  }

  return toSubjectResponse(subject, teacherId)
}

export const updateSubject = async (
  id: string,
  teacherId: string,
  data: UpdateSubjectRequest,
): Promise<SubjectResponse> => {
  await getSubject(id, teacherId)

  if (data.code) {
    const existing = await findSubjectByCode(data.code)

    if (existing && existing.id !== id) {
      throw new ConflictError(MESSAGES.SUBJECT_CODE_ALREADY_REGISTERED)
    }
  }

  const updated = await updateSubjectRecord(id, teacherId, data)

  if (!updated) {
    throw new NotFoundError('Subject')
  }

  return toSubjectResponse(updated, teacherId)
}

export const deleteSubject = async (id: string, teacherId: string): Promise<void> => {
  await getSubject(id, teacherId)

  const deleted = await deleteSubjectRecord(id, teacherId)

  if (!deleted) {
    throw new NotFoundError('Subject')
  }
}
