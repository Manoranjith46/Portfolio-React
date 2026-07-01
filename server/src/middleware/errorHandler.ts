import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError, ErrorCodes } from '../utils/AppError.js'
import { sendError } from '../utils/response.js'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message, err.details)
  }

  if (err instanceof ZodError) {
    return sendError(res, 400, ErrorCodes.ERR_VALIDATION, 'Validation failed', {
      issues: err.issues,
    })
  }

  console.error('[Unhandled Error]', err)

  return sendError(
    res,
    500,
    ErrorCodes.ERR_INTERNAL,
    'Internal server error',
  )
}

export function notFoundHandler(_req: Request, res: Response): Response {
  return sendError(res, 404, ErrorCodes.ERR_NOT_FOUND, 'Route not found')
}
