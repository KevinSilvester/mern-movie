import * as z from 'zod'

const schema = z.object({
   title: z
      .string({ required_error: 'Title cannot be empty' })
      .min(3, { message: 'Title must be at least 3 characters long' })
      .max(60, { message: 'Title cannot be longer than 60 characters' }),
   year: z
      .number({
         required_error: 'Year cannot be empty',
         invalid_type_error: 'Year cannot be empty'
      })
      .min(1888, { message: "Movies didn't exist before 1888" })
      .max(new Date().getFullYear(), {
         message: 'Year cannot be greater than the current year'
      }),
   genres: z.string().array().min(1, { message: 'Must select at least 1 Genre' }),
   director: z
      .string({ required_error: 'Director cannot be empty' })
      .min(3, { message: 'Name must be at least 3 characters long' })
      .array()
      .min(1, { message: 'Must have at least 1 Director' }),
   actors: z
      .string({ required_error: 'Actors cannot be empty' })
      .min(3, { message: 'Name must be at least 3 characters long' })
      .array()
      .min(1, { message: 'Must have at least 1 Actor' }),
   plot: z
      .string({ required_error: 'Plot cannot be empty' })
      .min(5, { message: 'Plot is too short' })
      .max(200, { message: "Plot can't be longer than 200 characters" }),
   runtime: z
      .number({
         required_error: 'Runtime cannot be empty',
         invalid_type_error: 'Runtime cannot be empty'
      })
      .min(40, { message: 'A Film cannot be shorter than 40 minutes' })
      .max(2000, {
         message: 'Runtime cannot exceed 2000 minutes'
      }),
      poster: z.object({
         image: z.string()
      })
})

export type SchemaType = typeof schema

export default schema
