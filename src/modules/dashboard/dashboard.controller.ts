import { Request, Response } from 'express'

import { ApiResponse } from '../../shared/ApiResponse.js'
import { asyncHandler } from '../../shared/asyncHandler.js'
import { getDashboardOverview } from './dashboard.service.js'

export const getDashboardOverviewController = asyncHandler(
  async (req: Request, res: Response) => {
    const overview = await getDashboardOverview(req.userId)

    ApiResponse.ok(res, overview)
  },
)
