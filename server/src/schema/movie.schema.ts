import { z, TypeOf } from 'zod'
import { ObjectId } from 'bson'

const bodySchema = z.object({
   _id: z.instanceof(ObjectId),
   title: z.string().nonempty({ message: 'Title cannot be empty' }),
   year: z.preprocess(
      str =>
         parseInt(z.string().regex(/^\d+$/, { message: 'Year must be a number' }).parse(str), 10),
      z
         .number()
         .min(1888, { message: "Movies didn't exist before 1888" })
         .max(new Date().getFullYear(), {
            message: 'Year cannot be greater than the current year'
         })
   ),
   genres: z.string().array().nonempty({ message: 'Genres cannot be empty' }),
   director: z.string().nonempty({ message: 'Director cannot be empty' }),
   actors: z.string().array().nonempty({ message: 'Actors cannot be empty' }),
   plot: z.string().nonempty({ message: 'Plot cannot be empty' }),
   runtime: z.preprocess(
      str =>
         parseInt(
            z.string().regex(/^\d+$/, { message: 'Runtime must be a number' }).parse(str),
            10
         ),
      z.number().min(40, { message: 'A Film cannot be shorter than 40 minutes' }).max(2000, {
         message: 'Not a valid runtime'
      })
   ),
   poster: z.object({
      image: z.string().nonempty({ message: 'An image must be provided' }),
      fallback: z.string().optional()
   })
})

const paramsSchema = z.object({
   id: z.instanceof(ObjectId)
})

export const createMovieSchema = z.object({ body: bodySchema.omit({ _id: true }) })
export type CreateMovieInput = TypeOf<typeof createMovieSchema>

export const updateMovieSchema = z.object({ 
   body: bodySchema,
   params: paramsSchema
 })
export type UpdateMovieInput = TypeOf<typeof updateMovieSchema>


// export const updateMovieSchema =

// export const deleteMovieSchema = object({
//    ...params
// })

// export const getMovieSchema = object({
//    ...params
// })
