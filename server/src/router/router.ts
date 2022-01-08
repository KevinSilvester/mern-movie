import { Router, Request, Response } from 'express'
import { createAllMoviesHandler, createMovieHandler, updateMovieHandler, getMovieHandler } from '../controller/movie.controller'

const router = Router()

router.get('/_health-check', (req: Request, res: Response) => {
   res.status(200).send({ message: 'Server Working ヾ(≧▽≦*)o' })
})

router.post('/movies', createAllMoviesHandler)
router.post('/movies/create', createMovieHandler)
router.get('/movie/:id', getMovieHandler)
router.put('/movie/:id', updateMovieHandler)
// router.get('/movies', getAllMovies)

export default router