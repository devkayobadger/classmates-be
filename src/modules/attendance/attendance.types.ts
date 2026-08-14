import type { z } from 'zod'

import type {
  AttendanceQuerySchema,
  AttendanceSchema,
  AttendanceSummaryQuerySchema,
  AttendanceSummarySchema,
  CopyAttendanceResultSchema,
  CopyAttendanceSchema,
  CreateAttendanceSchema,
  UpdateAttendanceSchema,
} from './attendance.schemas.js'

export type CreateAttendanceRequest = z.infer<typeof CreateAttendanceSchema>
export type UpdateAttendanceRequest = z.infer<typeof UpdateAttendanceSchema>
export type AttendanceQuery = z.infer<typeof AttendanceQuerySchema>
export type AttendanceSummaryQuery = z.infer<typeof AttendanceSummaryQuerySchema>
export type CopyAttendanceRequest = z.infer<typeof CopyAttendanceSchema>
export type AttendanceResponse = z.infer<typeof AttendanceSchema>
export type AttendanceSummaryResponse = z.infer<typeof AttendanceSummarySchema>
export type CopyAttendanceResult = z.infer<typeof CopyAttendanceResultSchema>

export interface AttendanceRecordRow {
  id: string
  studentId: string
  subjectId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  createdAt: Date
}
