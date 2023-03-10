import { NextFunction, Request, Response } from 'express'
import { logger } from '../../shared/providers'

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status: number = error.status || 500
    const message: string = error.message || 'Something went wrong'

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
      error,
    )
    res.status(status).json({ message })
  } catch (error) {
    next(error)
  }
}
