import type { z } from 'zod'

import type {
  CreateEnrollmentSchema,
  EnrollmentQuerySchema,
  EnrollmentSchema,
  UpdateEnrollmentSchema,
} from './enrollments.schemas.js'

export type CreateEnrollmentRequest = z.infer<typeof CreateEnrollmentSchema>
export type UpdateEnrollmentRequest = z.infer<typeof UpdateEnrollmentSchema>
export type EnrollmentQuery = z.infer<typeof EnrollmentQuerySchema>
export type EnrollmentResponse = z.infer<typeof EnrollmentSchema>

export interface EnrollmentRecord {
  id: string
  studentId: string
  subjectId: string
  internalMarks: number
  internalMarksTotal: number
  createdAt: Date
  updatedAt: Date
}

export interface EnrollmentWithStudent extends EnrollmentRecord {
  student: {
    id: string
    name: string
    rollNumber: string
    registrationNo: string
    email: string | null
    semester: number
  }
}
