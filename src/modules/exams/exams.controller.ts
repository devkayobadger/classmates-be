import { Request, Response } from 'express'

import { ApiResponse } from '../../shared/ApiResponse.js'
import { asyncHandler } from '../../shared/asyncHandler.js'
import { createExam, getExam, getExamMarks, listExams, saveExamMarks } from './exams.service.js'

export const createExamController = asyncHandler(async (req: Request, res: Response) => {
  const exam = await createExam(req.userId, req.body)

  ApiResponse.created(res, exam)
})

export const listExamsController = asyncHandler(async (req: Request, res: Response) => {
  const exams = await listExams(req.userId)

  ApiResponse.ok(res, exams)
})

export const getExamController = asyncHandler(async (req: Request, res: Response) => {
  const exam = await getExam(req.params.id, req.userId)

  ApiResponse.ok(res, exam)
})

export const getExamMarksController = asyncHandler(async (req: Request, res: Response) => {
  const exam = await getExamMarks(req.params.id, req.userId)

  ApiResponse.ok(res, exam)
})

export const saveExamMarksController = asyncHandler(async (req: Request, res: Response) => {
  await saveExamMarks(req.params.id, req.userId, req.body)

  ApiResponse.updated(res, {
    message: 'Exam marks saved successfully',
  })
})
