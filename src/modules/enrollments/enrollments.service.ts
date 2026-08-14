import { MESSAGES } from '../../constants/messages.js'
import { ConflictError, NotFoundError } from '../../shared/ApiError.js'
import { listAttendanceRecords } from '../attendance/attendance.repository.js'
import { findStudentById } from '../students/students.repository.js'
import { findSubjectById } from '../subjects/subjects.repository.js'
import {
  createEnrollment as createEnrollmentRecord,
  deleteEnrollment as deleteEnrollmentRecord,
  findEnrollmentById,
  findEnrollmentByStudentSubject,
  listEnrollmentsBySubject,
  updateEnrollment as updateEnrollmentRecord,
} from './enrollments.repository.js'
import type {
  CreateEnrollmentRequest,
  EnrollmentResponse,
  EnrollmentWithStudent,
  UpdateEnrollmentRequest,
} from './enrollments.types.js'

const toEnrollmentResponse = async (
  enrollment: EnrollmentWithStudent,
  teacherId: string,
): Promise<EnrollmentResponse> => {
  const records = await listAttendanceRecords({
    studentId: enrollment.studentId,
    subjectId: enrollment.subjectId,
    teacherId,
  })

  const totalClasses = records.length
  const presentCount = records.filter((r) => r.status === 'present').length
  const percentage =
    totalClasses === 0 ? 0 : Math.round((presentCount / totalClasses) * 10000) / 100

  return {
    id: enrollment.id,
    studentId: enrollment.studentId,
    subjectId: enrollment.subjectId,
    internalMarks: enrollment.internalMarks,
    internalMarksTotal: enrollment.internalMarksTotal,
    createdAt: enrollment.createdAt.toISOString(),
    updatedAt: enrollment.updatedAt.toISOString(),
    student: enrollment.student,
    attendance: { totalClasses, presentCount, percentage },
  }
}

const assertSubjectOwnership = async (subjectId: string, teacherId: string) => {
  const subject = await findSubjectById(subjectId, teacherId)

  if (!subject) {
    throw new NotFoundError('Subject')
  }

  return subject
}

export const enrollStudent = async (
  teacherId: string,
  data: CreateEnrollmentRequest,
): Promise<EnrollmentResponse> => {
  await assertSubjectOwnership(data.subjectId, teacherId)

  const student = await findStudentById(data.studentId)
  if (!student) {
    throw new NotFoundError('Student')
  }

  const existing = await findEnrollmentByStudentSubject(data.studentId, data.subjectId)
  if (existing) {
    throw new ConflictError(MESSAGES.STUDENT_ALREADY_ENROLLED)
  }

  const created = await createEnrollmentRecord(data)

  return toEnrollmentResponse(
    {
      ...created,
      student: {
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        registrationNo: student.registrationNo,
        email: student.email,
        semester: student.semester,
      },
    },
    teacherId,
  )
}

export const listRoster = async (
  teacherId: string,
  subjectId: string,
): Promise<EnrollmentResponse[]> => {
  await assertSubjectOwnership(subjectId, teacherId)

  const roster = await listEnrollmentsBySubject(subjectId)

  return Promise.all(roster.map((enrollment) => toEnrollmentResponse(enrollment, teacherId)))
}

export const updateMarks = async (
  teacherId: string,
  id: string,
  data: UpdateEnrollmentRequest,
): Promise<EnrollmentResponse> => {
  const existing = await findEnrollmentById(id)
  if (!existing) {
    throw new NotFoundError('Enrollment')
  }

  await assertSubjectOwnership(existing.subjectId, teacherId)

  await updateEnrollmentRecord(id, data)

  const roster = await listEnrollmentsBySubject(existing.subjectId)
  const updated = roster.find((e) => e.id === id)!

  return toEnrollmentResponse(updated, teacherId)
}

export const unenroll = async (teacherId: string, id: string): Promise<void> => {
  const existing = await findEnrollmentById(id)
  if (!existing) {
    throw new NotFoundError('Enrollment')
  }

  await assertSubjectOwnership(existing.subjectId, teacherId)

  const deleted = await deleteEnrollmentRecord(id)
  if (!deleted) {
    throw new NotFoundError('Enrollment')
  }
}
