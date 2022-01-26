import type { Request, Response } from 'express'
import type { FilterQuery } from 'mongoose'
import type {
   CreateMovieInput,
   GetAndDeleteMovieInput,
   UpdateMovieInput,
   MovieDoc,
   MovieSource
} from '../types'
import { createMovieSchema, updateMovieSchema, getAndDeleteMovieSchema } from './movie.schema'
import {
   resetDb,
   createMovie,
   findAndUpdateMovie,
   getMovie,
   getAllMovies,
   deleteMovie
   // getMovieFromExternal
} from './movie.service'
import {
   validateCreateMovie,
   validateGetAndDeleteMovie,
   validateUpdateMovie
} from './movie.validation'
import logger from '../utils/logger'

export const resetDbHandler = async (req: Request<{}, {}, MovieSource[]>, res: Response) => {
   try {
      const movies = await resetDb(req.body)
      res.status(201).json({ success: true, message: 'Database reset ＜（＾－＾）＞', movies })
   } catch (err: any) {
      logger.error({ error: err })
      res.status(409).json({ success: false, error: err.message })
   }
}

export const getAllMoviesHandler = async (req: Request, res: Response) => {
   try {
      const movies = await getAllMovies()
      res.status(200).json({ success: true, message: "Here's all the Movies ( ﾉ ﾟｰﾟ)ﾉ ", movies })
   } catch (err: any) {
      logger.error({ error: err })
      res.status(409).json({ success: false, error: err.message })
   }
}

export const createMovieHandler = async (
   req: Request<{}, {}, CreateMovieInput['body']>,
   res: Response
) => {
   try {
      const { body } = await validateCreateMovie(createMovieSchema, req.body)
      const movie = await createMovie(body)
      res.status(201).json({ success: true, message: 'Movie Added ヾ(≧▽≦*)o', movie })
   } catch (err: any) {
      logger.error({ error: err })
      res.status(409).json({ success: false, error: err })
   }
}

export const getMovieHandler = async (
   req: Request<GetAndDeleteMovieInput['params'], {}, {}>,
   res: Response
) => {
   try {
      const { params } = await validateGetAndDeleteMovie(getAndDeleteMovieSchema, req.params)
      const movie = await getMovie(params.id as FilterQuery<MovieDoc['_id']>)
      res.status(200).json({ success: true, message: 'Movie Found o(*^▽^*)┛', movie })
   } catch (err: any) {
      logger.error({ error: err })
      res.status(404).json({ success: false, error: err })
   }
}

export const updateMovieHandler = async (
   req: Request<UpdateMovieInput['params'], {}, UpdateMovieInput['body']>,
   res: Response
) => {
   try {
      const { body, params } = await validateUpdateMovie(updateMovieSchema, req.body, req.params)
      const movie = await findAndUpdateMovie(params.id as FilterQuery<MovieDoc['_id']>, body)
      res.status(200).json({ success: true, message: 'Movie Updated (～￣▽￣)～', movie })
   } catch (err: any) {
      logger.error({ error: err })
      res.status(404).json({ success: false, error: err })
   }
}

export const deleteMovieHandler = async (
   req: Request<GetAndDeleteMovieInput['params'], {}, {}>,
   res: Response
) => {
   try {
      const { params } = await validateGetAndDeleteMovie(getAndDeleteMovieSchema, req.params)
      const movie = await deleteMovie(params.id as FilterQuery<MovieDoc['_id']>)
      res.status(200).json({ success: true, message: 'Movie Deleted ( •̀ ω •́ )✧', movie })
   } catch (err: any) {
      logger.error({ error: err })
      res.status(404).json({ success: false, error: err })
   }
}

// /**
//  * Search: https://api.themoviedb.org/3/search/movie?api_key=${mdbKey}&query=${movie?.title}&page=1
//  * Movie: https://api.themoviedb.org/3/movie/${movieSearchRes.data.results[0].id}?api_key=${mdbKey}
//  * Video: https://api.themoviedb.org/3/movie/${movieRes.data.id}/videos?api_key=${mdbKey}&language=en
//  */

// export const getMovieFromExternalHandler = async (
//    req: Request<GetAndDeleteMovieInput['params'], {}, {}>,
//    res: Response
// ) => {

//    try {
//       const { params } = await validateGetAndDeleteMovie(getAndDeleteMovieSchema, req.params)
//       const movie = await getMovieFromExternal(params.id as FilterQuery<MovieDoc['_id']>)

//    } catch (err: any) {
//       logger.error({ error: err })
//       res.status(404).json({ success: false, error: err })
//    }
// }
