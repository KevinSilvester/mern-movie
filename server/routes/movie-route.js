import express from 'express'
import { getMovie, createMovie, addAllMovies, getAllMovies, getMovieValue, getFallbackImage } from '../controller/movie-controller.js'

const router = express.Router()

router.post('/all-movies', addAllMovies)
router.get('/all-movies', getAllMovies)
router.get('/external/image/:title', getFallbackImage)
router.get('/movie/:id/:key', getMovieValue)
router.get('/movie/:id', getMovie)
router.post('/movie', createMovie)

export default router