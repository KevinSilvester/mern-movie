import express from 'express'
import { getMovie, createMovie, addAllMovies } from '../controller/movie-controller.js'

const router = express.Router()

router.get('/', getMovie)
router.post('/', createMovie)
router.post('/all-movies', addAllMovies)
// router.get('/all-movies', getAllMovies)

export default router