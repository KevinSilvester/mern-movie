import { Types } from 'mongoose'
import { TypeOf } from 'zod'
import { createMovieSchema, getMoveSchema, updateMovieSchema } from './resources/movie.schema'

export interface MovieType {
   title: string
   year: number
   genres: Types.Array<string>
   director: string
   actors: Types.Array<string>
   plot: string
   runtime: number
   poster: {
      image: string
      fallback?: string
   }
}

export interface MovieDoc extends MovieType {
   _id: number
}

export type CreateMovieInput = TypeOf<typeof createMovieSchema>
export type GetAndDeleteMovieInput = TypeOf<typeof getMovieSchema>
export type UpdateMovieInput = TypeOf<typeof updateMovieSchema>
