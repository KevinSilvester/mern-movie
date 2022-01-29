import { z } from 'zod'

const bodySchema = z.object({
   title: z.string({ required_error: 'Title cannot be empty' }),
   year: z
      .number()
      .min(1888, { message: "Movies didn't exist before 1888" })
      .max(new Date().getFullYear(), {
         message: 'Year cannot be greater than the current year'
      }),
   genres: z.string({ required_error: 'Genres cannot be empty' }).array(),
   director: z.string({ required_error: 'Director cannot be empty' }).array(),
   actors: z.string({ required_error: 'Actors cannot be empty' }).array(),
   plot: z.string({ required_error: 'Plot cannot be empty' }),
   runtime: z.number().min(40, { message: 'A Film cannot be shorter than 40 minutes' }).max(2000, {
      message: 'Not a valid runtime'
   }),
   poster: z.object({
      image: z.string({ required_error: 'An image must be provided' }),
      fallback: z.string().optional()
   })
})

const paramsSchema = z.object({
   id: z.string({ required_error: 'Movie ID is required' })
})

export const createMovieSchema = z.object({ body: bodySchema })

export const updateMovieSchema = z.object({
   body: bodySchema,
   params: paramsSchema
})

export const getAndDeleteMovieSchema = z.object({ params: paramsSchema })
