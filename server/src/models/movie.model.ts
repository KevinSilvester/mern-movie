import { Schema, Model, model } from 'mongoose'
import { MovieDoc } from '../types'

const MovieSchema = new Schema<MovieDoc, Model<MovieDoc>, MovieDoc>(
   {
      title: { type: String, required: true },
      year: { type: Number, required: true },
      genres: { type: [String], required: true },
      director: { type: String, required: true },
      actors: { type: [String], required: true },
      plot: { type: String, required: true },
      runtime: { type: Number, required: true },
      poster: {
         image: { type: String, required: true },
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
