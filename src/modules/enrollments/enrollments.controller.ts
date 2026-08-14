import { Request, Response } from 'express'

import { ApiResponse } from '../../shared/ApiResponse.js'
import { asyncHandler } from '../../shared/asyncHandler.js'
import { enrollStudent, listRoster, unenroll, updateMarks } from './enrollments.service.js'

export const enrollStudentController = asyncHandler(async (req: Request, res: Response) => {
  const enrollment = await enrollStudent(req.userId, req.body)

  ApiResponse.created(res, enrollment)
})

export const listRosterController = asyncHandler(async (req: Request, res: Response) => {
  const { subjectId } = req.query as { subjectId: string }

  const roster = await listRoster(req.userId, subjectId)

  ApiResponse.ok(res, roster)
})

export const updateEnrollmentController = asyncHandler(async (req: Request, res: Response) => {
  const enrollment = await updateMarks(req.userId, req.params.id, req.body)

  ApiResponse.updated(res, enrollment)
})

export const unenrollController = asyncHandler(async (req: Request, res: Response) => {
  await unenroll(req.userId, req.params.id)

  ApiResponse.deleted(res, 'Student unenrolled successfully')
})
