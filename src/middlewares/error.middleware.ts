import { NextFunction, Request, Response } from 'express'

import { logger } from '../config/logger.js'
import { HTTP_STATUS } from '../constants/status-codes.js'
import { AppError } from '../shared/ApiError.js'

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error =
    err instanceof AppError ? err : err instanceof Error ? err : new Error('Unknown error')

  const statusCode =
    error instanceof AppError ? error.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR

  // Only AppError messages are written to be shown to clients (validation
  // failures, "not found", etc). Anything else (DB driver errors, unexpected
  // exceptions) can contain raw SQL, bind parameters, stack traces, or other
  // internal details, so those are logged in full but never sent to the client.
  const message =
    error instanceof AppError ? error.message || 'Internal Server Error' : 'Internal server error'

  logger.error({ err: error }, 'Request failed')

  res.status(statusCode).json({
    success: false,
    message,
  })
}
