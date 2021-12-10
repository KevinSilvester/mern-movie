import dotenv from 'dotenv'
import axios from 'axios'
import MovieModel from '../models/movie-model.js'

dotenv.config({ path: './../.env' })

export const getMovie = async (req, res) => { 
   const id = req.params.id
   try {
      const movie = await MovieModel.findById(id)
      res.status(200).json(movie)
   } catch (err) {
      res.status(404).json({ error: err.message })
   }
}

export const getMovieValue = async (req, res) => { 
   const id = req.params.id
   const key = req.params.key
   try {
      const movie = await MovieModel.findById(id)
      movie[key] ? res.status(200).json(movie[key]) : res.status(404).json({ error: 'Value not found' })
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

export const getFallbackImage = async (req, res) => {
   const title = req.params.title.replaceAll(' ', '%20').replaceAll('é', 'e')
   try {
      const movie = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MDB_KEY}&query=${title}&page=1`)
      const imagePath = await movie.data.results[0].poster_path
      res.status(200).json({ image: `https://image.tmdb.org/t/p/w500${imagePath}` })
   } catch (err) {
      console.log(title, err)
      res.status(404).json({ error: err.message })
   }
}
