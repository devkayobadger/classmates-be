import { z } from 'zod'

import { registry } from '../../lib/openapi/registry.js'

const dateSchema = z.string().date()

export const CreateAssignmentSchema = registry.register(
  'CreateAssignmentRequest',
  z.object({
    subjectId: z.string().uuid(),
    title: z.string().trim().min(1).max(255),
    description: z.string().trim().max(2000).nullable().optional(),
    assignedDate: dateSchema,
    dueDate: dateSchema,
  }),
)

export const UpdateAssignmentSchema = registry.register(
  'UpdateAssignmentRequest',
  z
    .object({
      subjectId: z.string().uuid().optional(),
      title: z.string().trim().min(1).max(255).optional(),
      description: z.string().trim().max(2000).nullable().optional(),
      assignedDate: dateSchema.optional(),
      dueDate: dateSchema.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, 'At least one field is required'),
)

export const AssignmentListQuerySchema = z.object({
  subjectId: z.string().uuid().optional(),
  search: z.string().trim().min(1).max(255).optional(),
  status: z.enum(['statuses-entered', 'in-progress', 'not-started']).optional(),
})

export const SaveAssignmentStatusesSchema = registry.register(
  'SaveAssignmentStatusesRequest',
  z.object({
    statuses: z.array(
      z.object({
        studentId: z.string().uuid(),
        status: z.enum(['done', 'not_done', 'late', 'excused']),
      }),
    ),
  }),
)
