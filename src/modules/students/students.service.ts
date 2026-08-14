import { MESSAGES } from '../../constants/messages.js'
import { ConflictError, NotFoundError } from '../../shared/ApiError.js'
import {
  createStudent as createStudentRecord,
  deleteStudent as deleteStudentRecord,
  findAllStudents,
  findStudentById,
  findStudentByRegistrationNo,
  findStudentByRollNumber,
  updateStudent as updateStudentRecord,
} from './students.repository.js'
import type {
  CreateStudentRequest,
  StudentRecord,
  StudentResponse,
  UpdateStudentRequest,
} from './students.types.js'

const toStudentResponse = (student: StudentRecord): StudentResponse => ({
  id: student.id,
  name: student.name,
  rollNumber: student.rollNumber,
  registrationNo: student.registrationNo,
  email: student.email,
  semester: student.semester,
  createdAt: student.createdAt.toISOString(),
  updatedAt: student.updatedAt.toISOString(),
})

export const createStudent = async (data: CreateStudentRequest): Promise<StudentResponse> => {
  const existingRoll = await findStudentByRollNumber(data.rollNumber)

  if (existingRoll) {
    throw new ConflictError(MESSAGES.ROLL_NUMBER_ALREADY_REGISTERED)
  }

  const existingRegistrationNo = await findStudentByRegistrationNo(data.registrationNo)

  if (existingRegistrationNo) {
    throw new ConflictError(MESSAGES.REGISTRATION_NO_ALREADY_REGISTERED)
  }

  const student = await createStudentRecord(data)

  return toStudentResponse(student)
}

export const listStudents = async (): Promise<StudentResponse[]> => {
  const students = await findAllStudents()

  return students.map(toStudentResponse)
}

export const getStudent = async (id: string): Promise<StudentResponse> => {
  const student = await findStudentById(id)

  if (!student) {
    throw new NotFoundError('Student')
  }

  return toStudentResponse(student)
}

export const updateStudent = async (
  id: string,
  data: UpdateStudentRequest,
): Promise<StudentResponse> => {
  await getStudent(id)

  if (data.rollNumber) {
    const existing = await findStudentByRollNumber(data.rollNumber)

    if (existing && existing.id !== id) {
      throw new ConflictError(MESSAGES.ROLL_NUMBER_ALREADY_REGISTERED)
    }
  }

  if (data.registrationNo) {
    const existing = await findStudentByRegistrationNo(data.registrationNo)

    if (existing && existing.id !== id) {
      throw new ConflictError(MESSAGES.REGISTRATION_NO_ALREADY_REGISTERED)
    }
  }

  const updated = await updateStudentRecord(id, data)

  if (!updated) {
    throw new NotFoundError('Student')
  }

  return toStudentResponse(updated)
}

export const deleteStudent = async (id: string): Promise<void> => {
  await getStudent(id)

  const deleted = await deleteStudentRecord(id)

  if (!deleted) {
    throw new NotFoundError('Student')
  }
}
