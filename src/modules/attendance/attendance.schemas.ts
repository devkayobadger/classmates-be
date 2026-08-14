import { z } from 'zod'

import { registry } from '../../lib/openapi/registry.js'

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

export const CreateAttendanceSchema = registry.register(
  'CreateAttendanceRequest',
  z.object({
    studentId: z.string().uuid(),
    subjectId: z.string().uuid(),
    date: dateStringSchema,
    status: z.enum(['present', 'absent', 'late', 'excused']),
  }),
)

export const UpdateAttendanceSchema = registry.register(
  'UpdateAttendanceRequest',
  z.object({
    date: dateStringSchema.optional(),
    status: z.enum(['present', 'absent', 'late', 'excused']).optional(),
  }),
)

export const AttendanceQuerySchema = z.object({
  studentId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
})

export const AttendanceSummaryQuerySchema = z.object({
  studentId: z.string().uuid(),
  subjectId: z.string().uuid(),
})

export const CopyAttendanceSchema = registry.register(
  'CopyAttendanceRequest',
  z.object({
    fromSubjectId: z.string().uuid(),
    toSubjectId: z.string().uuid(),
  }),
)

export const AttendanceSchema = registry.register(
  'Attendance',
  z.object({
    id: z.string(),
    studentId: z.string(),
    subjectId: z.string(),
    date: z.string(),
    status: z.enum(['present', 'absent', 'late', 'excused']),
    createdAt: z.string(),
  }),
)

export const AttendanceSummarySchema = registry.register(
  'AttendanceSummary',
  z.object({
    studentId: z.string(),
    subjectId: z.string(),
    totalClasses: z.number(),
    presentCount: z.number(),
    absentCount: z.number(),
    percentage: z.number(),
  }),
)

export const CopyAttendanceResultSchema = registry.register(
  'CopyAttendanceResult',
  z.object({
    copied: z.number(),
    skipped: z.number(),
    total: z.number(),
  }),
)
