import { MESSAGES } from '../../constants/messages.js'
import { ConflictError, NotFoundError } from '../../shared/ApiError.js'
import { findStudentById } from '../students/students.repository.js'
import { findSubjectById } from '../subjects/subjects.repository.js'
import {
  createAttendanceRecord,
  deleteAttendanceRecord,
  findAttendanceById,
  findAttendanceByStudentSubjectDate,
  listAttendanceRecords,
  updateAttendanceRecord,
} from './attendance.repository.js'
import type {
  AttendanceRecordRow,
  AttendanceResponse,
  AttendanceSummaryResponse,
  CopyAttendanceResult,
  CreateAttendanceRequest,
  UpdateAttendanceRequest,
} from './attendance.types.js'

const toAttendanceResponse = (record: AttendanceRecordRow): AttendanceResponse => ({
  id: record.id,
  studentId: record.studentId,
  subjectId: record.subjectId,
  date: record.date,
  status: record.status,
  createdAt: record.createdAt.toISOString(),
})

export const markAttendance = async (
  data: CreateAttendanceRequest,
  teacherId: string,
): Promise<AttendanceResponse> => {
  const student = await findStudentById(data.studentId)
  if (!student) {
    throw new NotFoundError('Student')
  }

  const subject = await findSubjectById(data.subjectId, teacherId)
  if (!subject) {
    throw new NotFoundError('Subject')
  }

  const existing = await findAttendanceByStudentSubjectDate(
    data.studentId,
    data.subjectId,
    data.date,
  )
  if (existing) {
    throw new ConflictError(MESSAGES.ATTENDANCE_ALREADY_MARKED)
  }

  const record = await createAttendanceRecord(data)
  return toAttendanceResponse(record)
}

export const listAttendance = async (
  filters: {
    studentId?: string
    subjectId?: string
  },
  teacherId: string,
): Promise<AttendanceResponse[]> => {
  const records = await listAttendanceRecords({ ...filters, teacherId })
  return records.map(toAttendanceResponse)
}

export const getAttendanceSummary = async (
  studentId: string,
  subjectId: string,
  teacherId: string,
): Promise<AttendanceSummaryResponse> => {
  const student = await findStudentById(studentId)
  if (!student) {
    throw new NotFoundError('Student')
  }

  const subject = await findSubjectById(subjectId, teacherId)
  if (!subject) {
    throw new NotFoundError('Subject')
  }

  const records = await listAttendanceRecords({ studentId, subjectId, teacherId })
  const totalClasses = records.length
  const presentCount = records.filter((r) => r.status === 'present').length
  const absentCount = totalClasses - presentCount
  const percentage =
    totalClasses === 0 ? 0 : Math.round((presentCount / totalClasses) * 10000) / 100

  return { studentId, subjectId, totalClasses, presentCount, absentCount, percentage }
}

export const updateAttendance = async (
  id: string,
  data: UpdateAttendanceRequest,
  teacherId: string,
): Promise<AttendanceResponse> => {
  const existing = await findAttendanceById(id)
  if (!existing) {
    throw new NotFoundError('Attendance record')
  }

  const subject = await findSubjectById(existing.subjectId, teacherId)
  if (!subject) {
    throw new NotFoundError('Attendance record')
  }

  const updated = await updateAttendanceRecord(id, data)
  if (!updated) {
    throw new NotFoundError('Attendance record')
  }

  return toAttendanceResponse(updated)
}

export const deleteAttendance = async (id: string, teacherId: string): Promise<void> => {
  const existing = await findAttendanceById(id)
  if (!existing) {
    throw new NotFoundError('Attendance record')
  }

  const subject = await findSubjectById(existing.subjectId, teacherId)
  if (!subject) {
    throw new NotFoundError('Attendance record')
  }

  const deleted = await deleteAttendanceRecord(id)
  if (!deleted) {
    throw new NotFoundError('Attendance record')
  }
}

export const copyAttendance = async (
  fromSubjectId: string,
  toSubjectId: string,
  teacherId: string,
): Promise<CopyAttendanceResult> => {
  const fromSubject = await findSubjectById(fromSubjectId, teacherId)
  if (!fromSubject) {
    throw new NotFoundError('Source subject')
  }

  const toSubject = await findSubjectById(toSubjectId, teacherId)
  if (!toSubject) {
    throw new NotFoundError('Target subject')
  }

  const sourceRecords = await listAttendanceRecords({ subjectId: fromSubjectId, teacherId })

  let copied = 0
  let skipped = 0

  for (const record of sourceRecords) {
    const existing = await findAttendanceByStudentSubjectDate(
      record.studentId,
      toSubjectId,
      record.date,
    )

    if (existing) {
      skipped++
      continue
    }

    await createAttendanceRecord({
      studentId: record.studentId,
      subjectId: toSubjectId,
      date: record.date,
      status: record.status,
    })
    copied++
  }

  return { copied, skipped, total: sourceRecords.length }
}
