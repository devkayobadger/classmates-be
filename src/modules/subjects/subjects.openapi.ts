import { z } from 'zod'

import { ErrorSchema, MessageSchema, ValidationErrorSchema } from '../../lib/openapi/schemas.js'
import { registerRoute } from '../../lib/openapi/route.js'
import { IdParamSchema } from '../../shared/common.schemas.js'
import { CreateSubjectSchema, SubjectSchema, UpdateSubjectSchema } from './subjects.schemas.js'

registerRoute({
  method: 'post',
  path: '/subjects',
  tag: 'Subjects',
  summary: 'Create a subject (owned by the logged-in teacher)',
  auth: true,
  body: CreateSubjectSchema,
  responses: {
    201: { description: 'Subject created', schema: SubjectSchema },
    400: { description: 'Validation failed', schema: ValidationErrorSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'get',
  path: '/subjects',
  tag: 'Subjects',
  summary: "List the logged-in teacher's subjects",
  auth: true,
  responses: {
    200: { description: 'Subjects retrieved', schema: z.array(SubjectSchema) },
    401: { description: 'Authentication required', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'get',
  path: '/subjects/{id}',
  tag: 'Subjects',
  summary: 'Get a subject by id',
  auth: true,
  params: IdParamSchema,
  responses: {
    200: { description: 'Subject retrieved', schema: SubjectSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    403: { description: 'Not this teacher\u2019s subject', schema: ErrorSchema },
    404: { description: 'Subject not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'put',
  path: '/subjects/{id}',
  tag: 'Subjects',
  summary: 'Update a subject',
  auth: true,
  params: IdParamSchema,
  body: UpdateSubjectSchema,
  responses: {
    200: { description: 'Subject updated', schema: SubjectSchema },
    400: { description: 'Validation failed', schema: ValidationErrorSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    403: { description: 'Not this teacher\u2019s subject', schema: ErrorSchema },
    404: { description: 'Subject not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'delete',
  path: '/subjects/{id}',
  tag: 'Subjects',
  summary: 'Delete a subject',
  auth: true,
  params: IdParamSchema,
  responses: {
    200: { description: 'Subject deleted', schema: MessageSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    403: { description: 'Not this teacher\u2019s subject', schema: ErrorSchema },
    404: { description: 'Subject not found', schema: ErrorSchema },
  },
})
