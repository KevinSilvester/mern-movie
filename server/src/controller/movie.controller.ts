import { Request, Response } from 'express'
import { ParamsDictionary, Params, Query } from 'express-serve-static-core'
import { Types } from 'mongoose'
import {
   createMovieSchema,
   CreateMovieInput,
   UpdateMovieInput,
   updateMovieSchema
} from '../schema/movie.schema'
import {
   createAllMovies,
   createMovie,
   findAndUpdateMovie,
   findMovie
} from '../services/movie.service'
import { validateCreateMovie, validateUpdateMovie } from '../middleware/validate.middleware'
import logger from '../utils/logger'
import zError from '../utils/zError'

// zod schema 43:00

/**
 * Handles request for adding all the movies to DB
 * @param req @type Request Server request
 * @param res @type Response Server response
 */
export const createAllMoviesHandler = async (
   req: Request<{}, {}, CreateMovieInput['body'][]>,
   res: Response
) => {
   try {
      const movies = await createAllMovies(req.body)
      res.sendStatus(201).json({ success: true, movies})
   } catch (err: any) {
      logger.error(err)
      res.sendStatus(409).json({ error: err.message })
   }
}

/**
 * Handles request for adding a single movie to DB
 * @param req @type Request Server request
 * @param res @type Response Server response
 */
export const createMovieHandler = async (
   req: Request<{}, {}, CreateMovieInput['body']>,
   res: Response
) => {
   try {
      const { body } = await validateCreateMovie(createMovieSchema, req.body)
      const movie = await createMovie(body)
      res.sendStatus(201).json({ success: true, message: 'Movie Added ヾ(≧▽≦*)o', movie })
   } catch (err: any) {
      // const errorMsg = zError(err)
      logger.error(err)
      res.sendStatus(409).json({ success: false, error: err })
   }
}

// export interface Query extends core.Query { }

// export interface Params extends core.ParamsDictionary { }

// interface RequestParams<T extends ParamsDictionary> extends Request {
//    params: T;
//  }

//  export interface Query extends Query { }

// export interface Params extends ParamsDictionary { }

//  export interface RequestWithParam<
//     ReqBody = any,
//     ReqQuery = Query,
//     URLParams extends Params = ParamsDictionary
//  > extends Request<URLParams, any, ReqBody, ReqQuery> {
//     params: UpdateMovieInput['params']
//  }

export const updateMovieHandler = async (
   req: Request<UpdateMovieInput['params']>,
   res: Response
) => {
   req
   try {
      const id = new Types.ObjectId(req.params.id)
      const { body, params } = await validateUpdateMovie(updateMovieSchema, req.body, { id: id })
      const movie = await findAndUpdateMovie(params, body)
      res.sendStatus(200).json({ success: true, message: 'Movie Updated (/≧▽≦)/', movie })
   } catch (err: any) {
      logger.error(err)
      res.sendStatus(404).json({ success: false, error: err })
   }
}

export const getMovieHandler = async (
   req: Request<UpdateMovieInput['params']>,
   res: Response
) => {
   try {
      console.log(req)
      const id = new Types.ObjectId(req.params.id)
      const movie = await findMovie(id)
      res.send(200).json({ success: true, message: 'Found the Movie (oﾟvﾟ)ノ', movie })
   } catch (err: any) {
      logger.error(err)
      res.sendStatus(404).json({ success: false, error: err })
   }
}

// export const getMovieHandler = async (req, res) => {}

// export const deleteMovieHandler = async (req, res) => {}
