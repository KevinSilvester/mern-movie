import type { Model } from 'mongoose'
import type { MovieDoc } from '../types'
import { Schema, model, } from 'mongoose'

const MovieSchema = new Schema<MovieDoc, Model<MovieDoc>, MovieDoc>(
   {
      _id: { type: String, required: true },
      title: { type: String, required: true },
      year: { type: Number, required: true },
      genres: { type: [String], required: true },
      director: { type: String, required: true },
      actors: { type: [String], required: true },
      plot: { type: String, required: true },
      runtime: { type: Number, required: true },
      poster: {
         image: String,
         fallback: String
      }
   },
   {
      collection: 'movies',
      versionKey: false
   }
)

const MovieModel = model<MovieDoc, Model<MovieDoc>>('Movie', MovieSchema)

export default MovieModel
