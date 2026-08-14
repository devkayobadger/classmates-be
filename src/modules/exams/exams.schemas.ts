import { z } from 'zod'

export const ExamTypeSchema = z.enum([
  'unit-test',
  'mid-term',
  'pre-board',
  'practical',
])

export const CreateExamSchema = z.object({
  subjectId: z.string().uuid(),
  type: ExamTypeSchema,
  title: z.string().min(1).max(200),
  totalMarks: z.number().int().positive(),
  examDate: z.string().date(),
})

export const UpdateExamSchema = z.object({
  type: ExamTypeSchema.optional(),
  title: z.string().min(1).max(200).optional(),
  totalMarks: z.number().int().positive().optional(),
  examDate: z.string().date().optional(),
})

export const SaveExamMarksSchema = z.object({
  marks: z.array(
    z.object({
      studentId: z.string().uuid(),
      marks: z.number().int().min(0).nullable(),
    }),
  ),
})