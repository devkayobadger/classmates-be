import { Request, Response } from 'express'

import { ApiResponse } from '../../shared/ApiResponse.js'
import { asyncHandler } from '../../shared/asyncHandler.js'
import {
  copyAttendance,
  deleteAttendance,
  getAttendanceSummary,
  listAttendance,
  markAttendance,
  updateAttendance,
} from './attendance.service.js'

export const markAttendanceController = asyncHandler(async (req: Request, res: Response) => {
  const record = await markAttendance(req.body, req.userId)
  ApiResponse.created(res, record)
})

export const listAttendanceController = asyncHandler(async (req: Request, res: Response) => {
  const records = await listAttendance(req.query, req.userId)
  ApiResponse.ok(res, records)
})

export const getAttendanceSummaryController = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, subjectId } = req.query as { studentId: string; subjectId: string }
  const summary = await getAttendanceSummary(studentId, subjectId, req.userId)
  ApiResponse.ok(res, summary)
})

export const updateAttendanceController = asyncHandler(async (req: Request, res: Response) => {
  const record = await updateAttendance(req.params.id, req.body, req.userId)
  ApiResponse.updated(res, record)
})

export const deleteAttendanceController = asyncHandler(async (req: Request, res: Response) => {
  await deleteAttendance(req.params.id, req.userId)
  ApiResponse.deleted(res, 'Attendance record deleted successfully')
})

export const copyAttendanceController = asyncHandler(async (req: Request, res: Response) => {
  const { fromSubjectId, toSubjectId } = req.body
  const result = await copyAttendance(fromSubjectId, toSubjectId, req.userId)
  ApiResponse.ok(res, result)
})
