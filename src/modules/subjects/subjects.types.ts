import type { z } from 'zod'

import type { CreateSubjectSchema, SubjectSchema, UpdateSubjectSchema } from './subjects.schemas.js'

export type CreateSubjectRequest = z.infer<typeof CreateSubjectSchema>
export type UpdateSubjectRequest = z.infer<typeof UpdateSubjectSchema>
export type SubjectResponse = z.infer<typeof SubjectSchema>

export interface SubjectRecord {
  id: string
  name: string
  code: string
  semester: number
  program: string
  color: string
  teacherId: string
  createdAt: Date
  updatedAt: Date
}
