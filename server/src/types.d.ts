import { Types } from 'mongoose'

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
   _id: Types.ObjectId
}
