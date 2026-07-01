import type { Response } from 'express'

const API_VERSION = '1'

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      version: API_VERSION,
      cachedAt: new Date().toISOString(),
    },
  })
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
): Response {
  return res.status(statusCode).json({
    success: false,
    code,
    message,
    ...(details ? { details } : {}),
  })
}
