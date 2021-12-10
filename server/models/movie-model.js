import mongoose from 'mongoose'

const MOVIE_SCHEMA = new mongoose.Schema({
   _id: Number,
   title: String,
   year: String,
   runtime: String,
   genres: [String],
   director: String,
   actors: [String],
   plot: String,
   posterUrl: String
}, { collection: 'movies' })

const MovieModel = mongoose.model('MovieModel', MOVIE_SCHEMA)

export default MovieModel