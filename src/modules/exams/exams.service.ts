import { MESSAGES } from '../../constants/messages.js'
import { ForbiddenError, NotFoundError } from '../../shared/ApiError.js'
import { findSubjectById } from '../subjects/subjects.repository.js'
import {
  countEnteredMarksByExam,
  countStudentsByExam,
  createExam as createExamRecord,
  createDefaultExams,
  findExamById,
  findExamStudents,
  findExamsByTeacher,
  upsertExamMark,
} from './exams.repository.js'
import type {
  CreateExamRequest,
  ExamResponse,
  ExamStatus,
  ExamRecord,
  ExamMarksResponse,
  SaveExamMarksRequest,
} from './exams.types.js'

const getExamStatus = (entered: number, total: number): ExamStatus => {
  if (entered === 0) return 'not-started'
  if (entered === total) return 'marks-entered'
  return 'in-progress'
}

const toExamResponse = async (exam: ExamRecord): Promise<ExamResponse> => {
  const [studentCount, enteredCount] = await Promise.all([
    countStudentsByExam(exam.id),
    countEnteredMarksByExam(exam.id),
  ])

  return {
    id: exam.id,
    subjectId: exam.subjectId,
    type: exam.type,
    title: exam.title,
    totalMarks: exam.totalMarks,
    examDate: exam.examDate,
    createdAt: exam.createdAt.toISOString(),
    updatedAt: exam.updatedAt.toISOString(),
    studentCount,
    enteredCount,
    status: getExamStatus(enteredCount, studentCount),
  }
}

const validateTotalMarks = (type: CreateExamRequest['type'], totalMarks: number): void => {
  const expectedMarks: Record<CreateExamRequest['type'], number> = {
    'unit-test': 20,
    'mid-term': 60,
    'pre-board': 60,
    practical: 20,
  }

  if (totalMarks !== expectedMarks[type]) {
    throw new Error(`${type} must have a total of ${expectedMarks[type]} marks`)
  }
}

export const createExam = async (
  teacherId: string,
  data: CreateExamRequest,
): Promise<ExamResponse> => {
  const subject = await findSubjectById(data.subjectId)

  if (!subject) {
    throw new NotFoundError('Subject')
  }

  if (subject.teacherId !== teacherId) {
    throw new ForbiddenError(MESSAGES.PERMISSION_DENIED)
  }

  validateTotalMarks(data.type, data.totalMarks)

  const exam = await createExamRecord({
    subjectId: data.subjectId,
    type: data.type,
    title: data.title,
    totalMarks: data.totalMarks,
    examDate: data.examDate ?? null,
  })

  return toExamResponse(exam)
}

export const listExams = async (teacherId: string): Promise<ExamResponse[]> => {
  const exams = await findExamsByTeacher(teacherId)

  return Promise.all(exams.map(toExamResponse))
}

export const getExam = async (id: string, teacherId: string): Promise<ExamResponse> => {
  const exam = await findExamById(id)

  if (!exam) {
    throw new NotFoundError('Exam')
  }

  const subject = await findSubjectById(exam.subjectId)

  if (!subject || subject.teacherId !== teacherId) {
    throw new ForbiddenError(MESSAGES.PERMISSION_DENIED)
  }

  return toExamResponse(exam)
}

export const getExamMarks = async (id: string, teacherId: string): Promise<ExamMarksResponse> => {
  const exam = await findExamById(id)

  if (!exam) {
    throw new NotFoundError('Exam')
  }

  const subject = await findSubjectById(exam.subjectId)

  if (!subject || subject.teacherId !== teacherId) {
    throw new ForbiddenError(MESSAGES.PERMISSION_DENIED)
  }

  const students = await findExamStudents(id)

  return {
    id: exam.id,
    title: exam.title,
    type: exam.type,
    totalMarks: exam.totalMarks,
    examDate: exam.examDate,
    subject: subject.name,
    program: subject.program ?? '',
    semester: String(subject.semester),
    dateLabel: exam.examDate ?? '',
    students,
  }
}

export const saveExamMarks = async (
  id: string,
  teacherId: string,
  data: SaveExamMarksRequest,
): Promise<void> => {
  const exam = await findExamById(id)

  if (!exam) {
    throw new NotFoundError('Exam')
  }

  const subject = await findSubjectById(exam.subjectId)

  if (!subject || subject.teacherId !== teacherId) {
    throw new ForbiddenError(MESSAGES.PERMISSION_DENIED)
  }

  for (const entry of data.marks) {
    if (entry.marks === null) {
      continue
    }

    if (entry.marks < 0 || entry.marks > exam.totalMarks) {
      throw new Error(`Marks for a student must be between 0 and ${exam.totalMarks}`)
    }

    await upsertExamMark(exam.id, entry.studentId, entry.marks)
  }
}

export const createDefaultExamsForSubject = async (subjectId: string): Promise<void> => {
  await createDefaultExams(subjectId)
}
