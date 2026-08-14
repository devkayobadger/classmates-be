import { z } from 'zod'

import { ErrorSchema, MessageSchema, ValidationErrorSchema } from '../../lib/openapi/schemas.js'
import { registerRoute } from '../../lib/openapi/route.js'
import { IdParamSchema } from '../../shared/common.schemas.js'
import { CreateStudentSchema, StudentSchema, UpdateStudentSchema } from './students.schemas.js'

registerRoute({
  method: 'post',
  path: '/students',
  tag: 'Students',
  summary: 'Create a student',
  auth: true,
  body: CreateStudentSchema,
  responses: {
    201: { description: 'Student created', schema: StudentSchema },
    400: { description: 'Validation failed', schema: ValidationErrorSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    409: { description: 'Roll number already registered', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'get',
  path: '/students',
  tag: 'Students',
  summary: 'List all students',
  auth: true,
  responses: {
    200: { description: 'Students retrieved', schema: z.array(StudentSchema) },
    401: { description: 'Authentication required', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'get',
  path: '/students/{id}',
  tag: 'Students',
  summary: 'Get a student by id',
  auth: true,
  params: IdParamSchema,
  responses: {
    200: { description: 'Student retrieved', schema: StudentSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    404: { description: 'Student not found', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'put',
  path: '/students/{id}',
  tag: 'Students',
  summary: 'Update a student',
  auth: true,
  params: IdParamSchema,
  body: UpdateStudentSchema,
  responses: {
    200: { description: 'Student updated', schema: StudentSchema },
    400: { description: 'Validation failed', schema: ValidationErrorSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    404: { description: 'Student not found', schema: ErrorSchema },
    409: { description: 'Roll number already registered', schema: ErrorSchema },
  },
})

registerRoute({
  method: 'delete',
  path: '/students/{id}',
  tag: 'Students',
  summary: 'Delete a student',
  auth: true,
  params: IdParamSchema,
  responses: {
    200: { description: 'Student deleted', schema: MessageSchema },
    401: { description: 'Authentication required', schema: ErrorSchema },
    404: { description: 'Student not found', schema: ErrorSchema },
  },
})
