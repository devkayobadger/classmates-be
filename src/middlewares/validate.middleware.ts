import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'

import { MESSAGES } from '../constants/messages.js'
import { HTTP_STATUS } from '../constants/status-codes.js'
import { ApiResponse } from '../shared/ApiResponse.js'

type ValidationTarget = 'body' | 'params' | 'query'

export const validate =
  (schema: ZodSchema, target: ValidationTarget = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({ [e.path.join('.')]: e.message }))
      return ApiResponse.error(
        res,
        { errors, message: MESSAGES.VALIDATION_FAILED },
        HTTP_STATUS.BAD_REQUEST,
      )
    }

    if (target === 'query') {
      Object.assign(req.query, result.data)
    } else {
      req[target] = result.data
    }
    next()
  }
