import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { getDb } from '../../db/index.js'
import { attendanceRecords, subjects } from '../../db/schema/index.js'
import type { AttendanceRecordRow } from './attendance.types.js'

const toAttendanceRecord = (row: typeof attendanceRecords.$inferSelect): AttendanceRecordRow => ({
  id: row.id,
  studentId: row.studentId,
  subjectId: row.subjectId,
  date: row.date,
  status: row.status,
  createdAt: row.createdAt,
})

export const createAttendanceRecord = async (data: {
  studentId: string
  subjectId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
}): Promise<AttendanceRecordRow> => {
  const [record] = await getDb()
    .insert(attendanceRecords)
    .values({ id: randomUUID(), ...data })
    .returning()
  return toAttendanceRecord(record)
}

export const findAttendanceById = async (id: string): Promise<AttendanceRecordRow | null> => {
  const [record] = await getDb()
    .select()
    .from(attendanceRecords)
    .where(eq(attendanceRecords.id, id))
    .limit(1)
  return record ? toAttendanceRecord(record) : null
}

export const findAttendanceByStudentSubjectDate = async (
  studentId: string,
  subjectId: string,
  date: string,
): Promise<AttendanceRecordRow | null> => {
  const [record] = await getDb()
    .select()
    .from(attendanceRecords)
    .where(
      and(
        eq(attendanceRecords.studentId, studentId),
        eq(attendanceRecords.subjectId, subjectId),
        eq(attendanceRecords.date, date),
      ),
    )
    .limit(1)
  return record ? toAttendanceRecord(record) : null
}

export const listAttendanceRecords = async (filters: {
  studentId?: string
  subjectId?: string
  teacherId: string
}): Promise<AttendanceRecordRow[]> => {
  const conditions = [eq(subjects.teacherId, filters.teacherId)]
  if (filters.studentId) conditions.push(eq(attendanceRecords.studentId, filters.studentId))
  if (filters.subjectId) conditions.push(eq(attendanceRecords.subjectId, filters.subjectId))

  const rows = await getDb()
    .select({
      id: attendanceRecords.id,
      studentId: attendanceRecords.studentId,
      subjectId: attendanceRecords.subjectId,
      date: attendanceRecords.date,
      status: attendanceRecords.status,
      createdAt: attendanceRecords.createdAt,
    })
    .from(attendanceRecords)
    .innerJoin(subjects, eq(attendanceRecords.subjectId, subjects.id))
    .where(and(...conditions))

  return rows.map(toAttendanceRecord)
}

export const updateAttendanceRecord = async (
  id: string,
  data: Partial<{ date: string; status: 'present' | 'absent' | 'late' | 'excused' }>,
): Promise<AttendanceRecordRow | null> => {
  const [record] = await getDb()
    .update(attendanceRecords)
    .set(data)
    .where(eq(attendanceRecords.id, id))
    .returning()
  return record ? toAttendanceRecord(record) : null
}

export const deleteAttendanceRecord = async (id: string): Promise<boolean> => {
  const result = await getDb()
    .delete(attendanceRecords)
    .where(eq(attendanceRecords.id, id))
    .returning()
  return result.length > 0
}
