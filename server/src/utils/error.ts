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
export const errorHandler = (error: HttpException, req: Request, res: Response) => {
   const code = error.statusCode || error.status || 500
   res.send(code).json({ error: 'Server Internal Error' })
}

/**
 * Creates 404 response
 * @param req @type Request Server request
 * @param res @type Response Server response
 */
export const notFoundHandler = (req: Request, res: Response) => {
   const message = 'Resource not found'
   res.status(404).send('Resource not found')
}
