export type ExamType = 'unit-test' | 'mid-term' | 'pre-board' | 'practical'

export type ExamStatus = 'marks-entered' | 'in-progress' | 'not-started'

export interface ExamRecord {
  id: string
  subjectId: string
  type: ExamType
  title: string
  totalMarks: number
  examDate: string
  createdAt: Date
  updatedAt: Date
}

export interface ExamStudentMark {
  id: string
  name: string
  rollNumber: string
  studentCode: string | null
  marks: number | null
}

export interface ExamResponse {
  id: string
  subjectId: string
  type: ExamType
  title: string
  totalMarks: number
  examDate: string
  createdAt: string
  updatedAt: string
  studentCount: number
  enteredCount: number
  status: ExamStatus
}

export interface ExamMarksResponse {
  id: string
  title: string
  type: ExamType
  totalMarks: number
  examDate: string
  subject: string
  program: string
  semester: string
  dateLabel: string
  students: ExamStudentMark[]
}

export interface CreateExamRequest {
  subjectId: string
  type: ExamType
  title: string
  totalMarks: number
  examDate: string
}

export interface UpdateExamRequest {
  type?: ExamType
  title?: string
  totalMarks?: number
  examDate?: string
}

export interface SaveExamMarksRequest {
  marks: Array<{
    studentId: string
    marks: number | null
  }>
}