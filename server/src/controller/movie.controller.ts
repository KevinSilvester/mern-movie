import { RequestHandler, Request, Response } from 'express'
import { createMovieSchema, CreateMovieInput } from '../schema/movie.schema'
import { createAllMovies, createMovie } from '../services/movie.service'
import { validateCreateMovie } from '../middleware/validate.middleware'
import logger from '../utils/logger'
import zError from '../utils/zError'

// zod schema 43:00

/**
 * Handles request for adding all the movies to DB
 * @param req @type Request Server request
 * @param res @type Response Server response
 */
export const createAllMoviesHandler: RequestHandler = async (
   req: Request<{}, {}, CreateMovieInput['body'][]>,
   res: Response
) => {
   try {
      const movies = await createAllMovies(req.body)
      res.status(201).json(movies)
   } catch (err: any) {
      logger.error(err)
      res.status(409).json({ error: err.message })
   }
}

/**
 * Handles request for adding a single movie to DB
 * @param req @type Request Server request
 * @param res @type Response Server response
 */
export const createMovieHandler: RequestHandler = async (
   req: Request<{}, {}, CreateMovieInput['body']>,
   res: Response
) => {
   try {
      const { body } = await validateCreateMovie(createMovieSchema, req.body)
      const movie = await createMovie(body)
      res.status(201).json({ success: 'Movie Added ヾ(≧▽≦*)o', movie })
   } catch (err: any) {
      const errorMsg = zError(err)
      logger.error({ error: errorMsg })
      res.status(409).json({ error: errorMsg })
   }
}

export const updateMovieHandler: RequestHandler = async (req, res) => {}

export const getAllMoviesHandler: RequestHandler = async (req: Request, res: Response) => {}

export const getMovieHandler: RequestHandler = async (req, res) => {}

export const deleteMovieHandler: RequestHandler = async (req, res) => {}
