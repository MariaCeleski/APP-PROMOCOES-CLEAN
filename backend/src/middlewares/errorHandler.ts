import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  code?: string
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[ErrorHandler]', err.message, err.stack)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Erro interno do servidor'

  res.status(statusCode).json({
    error: message,
    code: err.code,
  })
}

export function createError(
  message: string,
  statusCode = 500,
  code?: string,
): AppError {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  error.code = code
  return error
}
