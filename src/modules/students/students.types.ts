import type { z } from 'zod'

import type { CreateStudentSchema, StudentSchema, UpdateStudentSchema } from './students.schemas.js'

export type CreateStudentRequest = z.infer<typeof CreateStudentSchema>
export type UpdateStudentRequest = z.infer<typeof UpdateStudentSchema>
export type StudentResponse = z.infer<typeof StudentSchema>

export interface StudentRecord {
  id: string
  name: string
  rollNumber: string
  registrationNo: string
  email: string | null
  semester: number
  createdAt: Date
  updatedAt: Date
}
