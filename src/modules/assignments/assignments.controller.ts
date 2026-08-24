import type { Request, Response } from 'express'

import { ApiResponse } from '../../shared/ApiResponse.js'
import { asyncHandler } from '../../shared/asyncHandler.js'
import * as assignmentsService from './assignments.service.js'

export const createAssignmentController = asyncHandler(async (req: Request, res: Response) => {
  ApiResponse.created(res, await assignmentsService.createAssignment(req.userId, req.body))
})

export const listAssignmentsController = asyncHandler(async (req: Request, res: Response) => {
  ApiResponse.ok(res, await assignmentsService.listAssignments(req.userId, req.query))
})

export const getAssignmentController = asyncHandler(async (req: Request, res: Response) => {
  ApiResponse.ok(res, await assignmentsService.getAssignment(req.params.id, req.userId))
})

export const updateAssignmentController = asyncHandler(async (req: Request, res: Response) => {
  ApiResponse.updated(
    res,
    await assignmentsService.updateAssignment(req.params.id, req.userId, req.body),
  )
})

export const deleteAssignmentController = asyncHandler(async (req: Request, res: Response) => {
  await assignmentsService.deleteAssignment(req.params.id, req.userId)
  ApiResponse.deleted(res)
})

export const getAssignmentStatusesController = asyncHandler(async (req: Request, res: Response) => {
  ApiResponse.ok(res, await assignmentsService.getAssignmentStatuses(req.params.id, req.userId))
})

export const saveAssignmentStatusesController = asyncHandler(async (req: Request, res: Response) => {
  await assignmentsService.saveAssignmentStatuses(req.params.id, req.userId, req.body)
  ApiResponse.updated(res, { message: 'Assignment statuses saved successfully' })
})
