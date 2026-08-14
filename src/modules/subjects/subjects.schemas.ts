import { z } from 'zod'

import { registry } from '../../lib/openapi/registry.js'

export const CreateSubjectSchema = registry.register(
  'CreateSubjectRequest',
  z.object({
    name: z.string().min(1),
    code: z.string().min(1),
    semester: z.coerce.number().int().min(1).max(8),
    program: z.string().optional(),
    color: z.string().optional(),
  }),
)

export const UpdateSubjectSchema = registry.register(
  'UpdateSubjectRequest',
  CreateSubjectSchema.partial(),
)

export const SubjectSchema = registry.register(
  'Subject',
  z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    semester: z.number(),
    program: z.string(),
    color: z.string(),
    teacherId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    studentCount: z.number(),
    attendancePercentage: z.number(),
  }),
)
