import MovieModel from '../models/movie-model.js'

export const getMovie = async (req, res) => { 
   const id = req.param.id
   try {
      const movie = await MovieModel.findById(id)
      res.status(200).json(movie)
   } catch (err) {
      res.status(404).json({ error: err.message })
   }
}

export const createMovie = async (req, res) => {
   const body = req.body
   const newMovie = new MovieModel(body)
   try {
      await newMovie.save()
      res.status(201).json(newMovie)
   } catch (err) {
      res.status(409).json({ error: err.message })
   }
}

export const addAllMovies = async (req, res) => {
   const body = req.body
   try {
      await MovieModel.deleteMany({})
      const allMovies = await MovieModel.insertMany(body)
      res.status(201).json(allMovies)
   } catch (err) {
      res.status(409).json({ error: err.message })
   }
}

export const getAllMovies = async (req, res) => {
   try {
      const allMovies = await MovieModel.find({})
      res.status(200).json(allMovies)
   } catch (err) {
      res.status(404).json({ error: err.message })
   }
}
