import { z } from 'zod'

import { ErrorSchema, MessageSchema, ValidationErrorSchema } from '../../lib/openapi/schemas.js'
import { registerRoute } from '../../lib/openapi/route.js'
import { IdParamSchema } from '../../shared/common.schemas.js'
import {
  AttendanceSchema,
  AttendanceSummarySchema,
  CopyAttendanceResultSchema,
  CopyAttendanceSchema,
  CreateAttendanceSchema,
  UpdateAttendanceSchema,
} from './attendance.schemas.js'

registerRoute({
  method: 'post',
  path: '/attendance',
  tag: 'Attendance',
  summary: 'Mark attendance for a student in a subject on a date',
  auth: true,
  body: CreateAttendanceSchema,
  responses: {
    201: { description: 'Attendance marked', schema: AttendanceSchema },
    400: { description: 'Validation failed', schema: ValidationErrorSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    404: { description: 'Student or subject not found', schema: ErrorSchema },
    409: { description: 'Attendance already marked for this date', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'post',
  path: '/attendance/copy',
  tag: 'Attendance',
  summary: 'Copy attendance records from one subject to another',
  auth: true,
  body: CopyAttendanceSchema,
  responses: {
    200: { description: 'Attendance copied', schema: CopyAttendanceResultSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    404: { description: 'Source or target subject not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'get',
  path: '/attendance/summary',
  tag: 'Attendance',
  summary: 'Get calculated attendance percentage for a student in a subject',
  auth: true,
  responses: {
    200: { description: 'Attendance summary', schema: AttendanceSummarySchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    404: { description: 'Student or subject not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'get',
  path: '/attendance',
  tag: 'Attendance',
  summary: 'List attendance records, optionally filtered by student or subject',
  auth: true,
  responses: {
    200: { description: 'Attendance records retrieved', schema: z.array(AttendanceSchema) },
    401: { description: 'Authentication required', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'put',
  path: '/attendance/{id}',
  tag: 'Attendance',
  summary: 'Update an attendance record',
  auth: true,
  params: IdParamSchema,
  body: UpdateAttendanceSchema,
  responses: {
    200: { description: 'Attendance record updated', schema: AttendanceSchema },
    400: { description: 'Validation failed', schema: ValidationErrorSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    404: { description: 'Attendance record not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'delete',
  path: '/attendance/{id}',
  tag: 'Attendance',
  summary: 'Delete an attendance record',
  auth: true,
  params: IdParamSchema,
  responses: {
    200: { description: 'Attendance record deleted', schema: MessageSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    404: { description: 'Attendance record not found', schema: ErrorSchema },
  },
})
