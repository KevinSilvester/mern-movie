import type { Request, Response } from 'express'
import { Router } from 'express'
import {
   resetDbHandler,
   createMovieHandler,
   updateMovieHandler,
   getMovieHandler,
   getAllMoviesHandler,
   deleteMovieHandler
} from './resources/movie.controller'

const router = Router()

router.get('/__healthcheck', (req: Request, res: Response) => {
   res.status(200).send({ message: 'Server Working ヾ(≧▽≦*)o' })
})

router.post('/movie/reset', resetDbHandler)
router.post('/movie', createMovieHandler)
router.get('/movie', getAllMoviesHandler)

router.put('/movie/:id', updateMovieHandler)
router.get('/movie/:id', getMovieHandler)
router.delete('/movie/:id', deleteMovieHandler)

router.get('/movie/:id/external')

export default router
