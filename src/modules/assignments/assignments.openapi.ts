import { z } from 'zod'

import { ErrorSchema, MessageSchema, ValidationErrorSchema } from '../../lib/openapi/schemas.js'
import { registerRoute } from '../../lib/openapi/route.js'
import { IdParamSchema } from '../../shared/common.schemas.js'
import {
  AssignmentListQuerySchema,
  CreateAssignmentSchema,
  SaveAssignmentStatusesSchema,
  UpdateAssignmentSchema,
} from './assignments.schemas.js'

const AssignmentSchema = z.object({
  id: z.string().uuid(),
  subjectId: z.string().uuid(),
  subjectName: z.string(),
  subjectCode: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  assignedDate: z.string().date(),
  dueDate: z.string().date(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  studentCount: z.number().int(),
  enteredCount: z.number().int(),
  status: z.enum(['statuses-entered', 'in-progress', 'not-started']),
})

const AssignmentStatusesSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  assignedDate: z.string().date(),
  dueDate: z.string().date(),
  subject: z.string(),
  subjectCode: z.string(),
  program: z.string(),
  semester: z.string(),
  students: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      rollNumber: z.string(),
      studentCode: z.string().nullable(),
      status: z.enum(['done', 'not_done', 'late', 'excused']).nullable(),
    }),
  ),
})

registerRoute({
  method: 'post',
  path: '/assignments',
  tag: 'Assignments',
  summary: 'Create an assignment for a subject',
  auth: true,
  body: CreateAssignmentSchema,
  responses: {
    201: { description: 'Assignment created', schema: AssignmentSchema },
    400: { description: 'Validation failed', schema: ValidationErrorSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    404: { description: 'Subject not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'get',
  path: '/assignments',
  tag: 'Assignments',
  summary: 'List assignments with optional subject, text, and entry-status filters',
  auth: true,
  query: AssignmentListQuerySchema,
  responses: {
    200: { description: 'Assignments retrieved', schema: z.array(AssignmentSchema) },
    401: { description: 'Authentication required', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'get',
  path: '/assignments/{id}',
  tag: 'Assignments',
  summary: 'Get an assignment',
  auth: true,
  params: IdParamSchema,
  responses: {
    200: { description: 'Assignment retrieved', schema: AssignmentSchema },
    404: { description: 'Assignment not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'put',
  path: '/assignments/{id}',
  tag: 'Assignments',
  summary: 'Update an assignment',
  auth: true,
  params: IdParamSchema,
  body: UpdateAssignmentSchema,
  responses: {
    200: { description: 'Assignment updated', schema: AssignmentSchema },
    400: { description: 'Invalid assignment update', schema: ValidationErrorSchema },
    404: { description: 'Assignment not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'delete',
  path: '/assignments/{id}',
  tag: 'Assignments',
  summary: 'Delete an assignment and its student statuses',
  auth: true,
  params: IdParamSchema,
  responses: {
    200: { description: 'Assignment deleted', schema: MessageSchema },
    404: { description: 'Assignment not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'get',
  path: '/assignments/{id}/statuses',
  tag: 'Assignments',
  summary: 'Get enrolled students and their assignment statuses',
  auth: true,
  params: IdParamSchema,
  responses: {
    200: { description: 'Assignment statuses retrieved', schema: AssignmentStatusesSchema },
    404: { description: 'Assignment not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'put',
  path: '/assignments/{id}/statuses',
  tag: 'Assignments',
  summary: 'Save statuses for students enrolled in the assignment subject',
  auth: true,
  params: IdParamSchema,
  body: SaveAssignmentStatusesSchema,
  responses: {
    200: { description: 'Assignment statuses saved', schema: MessageSchema },
    400: { description: 'Invalid statuses', schema: ValidationErrorSchema },
    404: { description: 'Assignment not found', schema: ErrorSchema },
  },
})
