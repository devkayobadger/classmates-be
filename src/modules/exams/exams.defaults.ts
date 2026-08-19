import type { ExamType } from './exams.types.js'

export const DEFAULT_EXAMS: Array<{
  type: ExamType
  title: string
  totalMarks: number
}> = [
  {
    type: 'unit-test',
    title: 'Unit Test',
    totalMarks: 20,
  },
  {
    type: 'mid-term',
    title: 'Mid-term',
    totalMarks: 60,
  },
  {
    type: 'pre-board',
    title: 'Pre-board',
    totalMarks: 60,
  },
  {
    type: 'practical',
    title: 'Practical Exam',
    totalMarks: 20,
  },
]
