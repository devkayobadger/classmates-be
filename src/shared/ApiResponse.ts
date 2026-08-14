import { Response } from 'express'

import { HTTP_STATUS } from '../constants/status-codes.js'

type ErrorPayload = {
  message: string
  errors?: unknown
}

export class ApiResponse {
  static ok(res: Response, data: object = {}, statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json(data)
  }

  static created(res: Response, data: object = {}) {
    return res.status(HTTP_STATUS.CREATED).json(data)
  }

  static updated(res: Response, data: object = {}) {
    return res.status(HTTP_STATUS.OK).json(data)
  }

  static deleted(res: Response, detail = 'Deleted successfully') {
    return res.status(HTTP_STATUS.OK).json({
      detail,
    })
  }

  static error(res: Response, payload: ErrorPayload, statusCode = HTTP_STATUS.BAD_REQUEST) {
    return res.status(statusCode).json({
      success: false,
      ...payload,
    })
  }

  static item(res: Response, item: object) {
    return res.status(HTTP_STATUS.OK).json(item)
  }

  static list(
    res: Response,
    results: unknown[],
    total: number,
    page: number,
    limit: number,
    baseUrl?: string,
  ) {
    const offset = (page - 1) * limit

    const nextOffset = offset + limit
    const previousOffset = offset - limit

    const next =
      baseUrl && nextOffset < total ? `${baseUrl}?offset=${nextOffset}&limit=${limit}` : null

    const previous =
      baseUrl && previousOffset >= 0 ? `${baseUrl}?offset=${previousOffset}&limit=${limit}` : null

    return res.status(HTTP_STATUS.OK).json({
      count: total,
      next,
      previous,
      results,
    })
  }
}
