import { z } from 'zod'

import { registry } from '../../lib/openapi/registry.js'

export const CreateEnrollmentSchema = registry.register(
  'CreateEnrollmentRequest',
  z.object({
    studentId: z.string().uuid(),
    subjectId: z.string().uuid(),
  }),
)

export const UpdateEnrollmentSchema = registry.register(
  'UpdateEnrollmentRequest',
  z.object({
    internalMarks: z.coerce.number().int().min(0).optional(),
    internalMarksTotal: z.coerce.number().int().min(1).optional(),
  }),
)

export const EnrollmentQuerySchema = z.object({
  subjectId: z.string().uuid(),
})

export const EnrollmentStudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  rollNumber: z.string(),
  registrationNo: z.string(),
  email: z.string().nullable(),
  semester: z.number(),
})

export const EnrollmentSchema = registry.register(
  'Enrollment',
  z.object({
    id: z.string(),
    studentId: z.string(),
    subjectId: z.string(),
    internalMarks: z.number(),
    internalMarksTotal: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    student: EnrollmentStudentSchema,
    attendance: z.object({
      totalClasses: z.number(),
      presentCount: z.number(),
      percentage: z.number(),
    }),
  }),
)
