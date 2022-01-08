import { ErrorRequestHandler, Request, Response, RequestHandler } from 'express'

/**
 * Exception with Http error code
 */
class HttpException extends Error {
   statusCode?: number
   status?: number
   message: string
   error: string | null

   constructor(statusCode: number, message: string, error?: string) {
      super(message)
      this.statusCode = statusCode
      this.message = message
      this.error = error || null
   }
}

/**
 * Creates server error response
 * @param error @type HttpException Error object with Http error code
 * @param req @type Request Server request
 * @param res @type Response Server response
 */
export const errorHandler: ErrorRequestHandler = (
   error: HttpException,
   req: Request,
   res: Response,
) => {
   const status = error.statusCode || error.status || 500
   res.sendStatus(status).json({error : 'error'})
}

/**
 * Creates 404 response
 * @param req @type Request Server request
 * @param res @type Response Server response
 */
export const notFoundHandler: RequestHandler = (req: Request, res: Response) => {
   const message = 'Resource not found'
   res.sendStatus(404).send(message)
}
