export const ErrorCodes = {
  ERR_NOT_FOUND: 'ERR_NOT_FOUND',
  ERR_VALIDATION: 'ERR_VALIDATION',
  ERR_AUTH_FAILED: 'ERR_AUTH_FAILED',
  ERR_FORBIDDEN: 'ERR_FORBIDDEN',
  ERR_INTERNAL: 'ERR_INTERNAL',
  ERR_AI_FAILED: 'ERR_AI_FAILED',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

export class AppError extends Error {
  readonly statusCode: number
  readonly code: ErrorCode
  readonly details?: Record<string, unknown>

  constructor(
    statusCode: number,
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}
