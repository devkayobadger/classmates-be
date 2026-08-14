import { HTTP_STATUS } from '../constants/status-codes.js'

export class AppError extends Error {
  statusCode: number
  detail: string

  constructor(statusCode: number, detail: string) {
    super(detail)

    this.statusCode = statusCode
    this.detail = detail

    this.name = new.target.name

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class BadRequestError extends AppError {
  constructor(detail: string = 'Bad request') {
    super(HTTP_STATUS.BAD_REQUEST, detail)
  }
}

export class UnauthorizedError extends AppError {
  constructor(detail: string = 'Unauthorized') {
    super(HTTP_STATUS.UNAUTHORIZED, detail)
  }
}

export class ForbiddenError extends AppError {
  constructor(detail: string = 'Forbidden') {
    super(HTTP_STATUS.FORBIDDEN, detail)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(HTTP_STATUS.NOT_FOUND, `${resource} not found`)
  }
}

export class ConflictError extends AppError {
  constructor(detail: string) {
    super(HTTP_STATUS.CONFLICT, detail)
  }
}

export class ApiError extends AppError {}
