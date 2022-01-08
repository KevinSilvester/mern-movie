import type { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError, z } from 'zod'
import logger from '../utils/logger'
import { badRequest } from '@hapi/boom'
import { CreateMovieInput, UpdateMovieInput } from '../schema/movie.schema'

// export async function zParse<T extends AnyZodObject>(schema: T, req: Request): Promise<z.infer<T>> {
//    try {
//       return schema.parseAsync(req)
//    } catch (error) {
//       if (error instanceof ZodError) {
//          throw badRequest(error.message)
//       }
//       return badRequest(JSON.stringify(error))
//    }
// }

// const validate =
//    (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
//       try {
//          schema.parse({
//             body: req.body,
//             query: req.query,
//             params: req.params
//          })
//          next()
//       } catch (err: any) {
//          logger.log(err)
//          return res.status(400).send({ error: err.flatten().fieldErrors.body })
//       }
//    }

// export default validate

export const validateCreateMovie = async <T extends AnyZodObject>(
   schema: T,
   reqBody: CreateMovieInput['body']
): Promise<z.infer<T>> => {
   try {
      return schema.parseAsync({ body: reqBody })
   } catch (err: any) {
      throw new Error(err)
   }
}

export const validateUpdateMovie = async <T extends AnyZodObject>(
   schema: T,
   reqBody: UpdateMovieInput['body'],
   reqParams: UpdateMovieInput['params']
): Promise<z.infer<T>> => {
   try {
      return schema.parseAsync({ body: reqBody , params: reqParams })
   } catch (err: any) {
      throw new Error(err)
   }
}

// export const validateUpdateMovie = async <T extends AnyZodObject>(
//    schema: T,
//    reqBody: UpdateMovieInput['body']
// ): Promise<z.infer<T>> => {
//    try {
//       return schema.parseAsync({ body: reqBody })
//    } catch (err: any) {
//       throw new Error(err)
//    }
// }


