import { Request, Response } from 'express'

import { ApiResponse } from '../../shared/ApiResponse.js'
import { asyncHandler } from '../../shared/asyncHandler.js'
import {
  createStudent,
  deleteStudent,
  getStudent,
  listStudents,
  updateStudent,
} from './students.service.js'

export const createStudentController = asyncHandler(async (req: Request, res: Response) => {
  const student = await createStudent(req.body)

  ApiResponse.created(res, student)
})

export const listStudentsController = asyncHandler(async (req: Request, res: Response) => {
  const students = await listStudents()

  ApiResponse.ok(res, students)
})

export const getStudentController = asyncHandler(async (req: Request, res: Response) => {
  const student = await getStudent(req.params.id)

  ApiResponse.ok(res, student)
})

export const updateStudentController = asyncHandler(async (req: Request, res: Response) => {
  const student = await updateStudent(req.params.id, req.body)

  ApiResponse.updated(res, student)
})

export const deleteStudentController = asyncHandler(async (req: Request, res: Response) => {
  await deleteStudent(req.params.id)

  ApiResponse.deleted(res, 'Student deleted successfully')
})
