import { Request, Response } from 'express'

import { ApiResponse } from '../../shared/ApiResponse.js'
import { asyncHandler } from '../../shared/asyncHandler.js'
import {
  createSubject,
  deleteSubject,
  getSubject,
  listSubjects,
  updateSubject,
} from './subjects.service.js'

export const createSubjectController = asyncHandler(async (req: Request, res: Response) => {
  const subject = await createSubject(req.userId, req.body)

  ApiResponse.created(res, subject)
})

export const listSubjectsController = asyncHandler(async (req: Request, res: Response) => {
  const subjects = await listSubjects(req.userId)

  ApiResponse.ok(res, subjects)
})

export const getSubjectController = asyncHandler(async (req: Request, res: Response) => {
  const subject = await getSubject(req.params.id, req.userId)

  ApiResponse.ok(res, subject)
})

export const updateSubjectController = asyncHandler(async (req: Request, res: Response) => {
  const subject = await updateSubject(req.params.id, req.userId, req.body)

  ApiResponse.updated(res, subject)
})

export const deleteSubjectController = asyncHandler(async (req: Request, res: Response) => {
  await deleteSubject(req.params.id, req.userId)

  ApiResponse.deleted(res, 'Subject deleted successfully')
})
