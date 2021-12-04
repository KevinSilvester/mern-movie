import express from 'express'
import { getMovie, createMovie, addAllMovies, getAllMovies } from '../controller/movie-controller.js'

const router = express.Router()

router.post('/all-movies', addAllMovies)
router.get('/all-movies', getAllMovies)
router.get('/:id', getMovie)
router.post('/', createMovie)


export default router