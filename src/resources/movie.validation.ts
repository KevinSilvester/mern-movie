import type { AnyZodObject } from 'zod'
import type { CreateMovieInput, UpdateMovieInput, GetAndDeleteMovieInput, SearchMovieInput } from '../types'
import { z } from 'zod'

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
      return schema.parseAsync({ body: reqBody, params: reqParams })
   } catch (err: any) {
      throw new Error(err)
   }
}

export const validateGetAndDeleteMovie = async <T extends AnyZodObject>(
   schema: T,
   reqParams: GetAndDeleteMovieInput['params']
): Promise<z.infer<T>> => {
   try {
      return schema.parseAsync({ params: reqParams })
   } catch (err: any) {
      throw new Error(err)
   }
}

export const validateSearchMovie = async <T extends AnyZodObject>(
   schema: T,
   reqQuery: SearchMovieInput['query']
): Promise<z.infer<T>> => {
   try {
      return schema.parseAsync({ query: reqQuery })
   } catch (err: any) {
      throw new Error(err)
   }
}