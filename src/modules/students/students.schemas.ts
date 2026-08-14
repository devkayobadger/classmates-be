import { z } from 'zod'

import { registry } from '../../lib/openapi/registry.js'

export const CreateStudentSchema = registry.register(
  'CreateStudentRequest',
  z.object({
    name: z.string().min(1),
    rollNumber: z.string().min(1),
    registrationNo: z.string().min(1),
    email: z.string().email().optional(),
    semester: z.coerce.number().int().min(1).max(8),
  }),
)

export const UpdateStudentSchema = registry.register(
  'UpdateStudentRequest',
  CreateStudentSchema.partial(),
)

export const StudentSchema = registry.register(
  'Student',
  z.object({
    id: z.string(),
    name: z.string(),
    rollNumber: z.string(),
    registrationNo: z.string(),
    email: z.string().nullable(),
    semester: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
)
