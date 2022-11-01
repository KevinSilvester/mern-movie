import type { Aggregate, DocumentDefinition, FilterQuery, PipelineStage, QueryOptions, UpdateQuery } from 'mongoose'
import type { MovieDoc, MovieSource, SearchMovieInput } from '../types'
import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'
import MovieModel from './movie.model'
import { getFromMdb } from '../utils/mdbApi'
import logger from '../utils/logger'

const nanoid = customAlphabet(alphanumeric, 25)

export const resetDb = async (movies: MovieSource[]): Promise<MovieDoc[]> => {
   try {
      const data: DocumentDefinition<MovieDoc>[] = await Promise.all(
         movies.map(
            async ({ id, actors, director, posterUrl, year, runtime, ...rest }) => ({
               ...rest,
               _id: nanoid(),
               year: parseInt(year),
               actors: actors.split(', '),
               director: director.split(', '),
               runtime: parseInt(runtime),
               poster: {
                  image: posterUrl,
                  fallback: (await getFromMdb(rest.title, year)).fallback
               }
            })
         )
      )
      await MovieModel.deleteMany({})
      return await MovieModel.insertMany(data)
   } catch (e: any) {
      throw new Error(e)
   }
}

export const getAllMovies = async (query: FilterQuery<SearchMovieInput['query']>) => {
   try {
      let aggregate: PipelineStage[] = []

      if (query.title) {
         const search = {
            $search: {
               index: 'index',
               autocomplete: {
                  query: query.title,
                  path: 'title'
               }
            }
         }
         aggregate = [...aggregate, search]
      }

      if (query.year) {
         const year = {
            $match: { year: query.year }
         }
         aggregate = [...aggregate, year]
      }

      if (query.genres && query.genres.length > 0) {
         const genres = {
            $match: {
               genres: { $in: [...query.genres] }
            }
         }
         aggregate = [...aggregate, genres]
      }

      if (query.sort && (query.sortOrder === -1 || query.sortOrder === 1)) {
         const sort = {
            $sort: { [query.sort]: query.sortOrder }
         }
         aggregate = [...aggregate, sort]
      }

      logger.info(aggregate)

      if (aggregate.length > 0 && query.title.length > 0) return await MovieModel.aggregate(aggregate)
      return await MovieModel.find().sort({ updatedAt: -1 })
   } catch (e: any) {
      throw new Error(e)
   }
}

export const createMovie = async (movie: DocumentDefinition<Omit<MovieDoc, '_id'>>) => {
   try {
      const doc = {
         ...movie,
         _id: nanoid(),
         poster: {
            image: movie.poster.image,
            fallback: (await getFromMdb(movie.title, movie.year)).fallback
         }
      }
      return await MovieModel.create(doc)
   } catch (e: any) {
      throw new Error(e)
   }
}

export const getMovie = async (id: FilterQuery<MovieDoc['_id']>) => {
   try {
      const movie = await MovieModel.findById(id)
      if (!movie?.toObject()) throw new Error('Movie Not Found')
      const { links, backdrop } = await getFromMdb(movie.title, movie.year)
      return { ...movie.toObject(), links, backdrop }
   } catch (e: any) {
      throw new Error(e)
   }
}

export const getYearList = async () => {
   try {
      return await MovieModel.distinct('year')
   } catch (e: any) {
      throw new Error(e)
   }
}

export const findAndUpdateMovie = async (
   id: FilterQuery<MovieDoc['_id']>,
   update: DocumentDefinition<Omit<MovieDoc, '_id'>>
) => {
   try {
      const movie = {
         ...update,
         poster: {
            image: update.poster.image,
            fallback: (await getFromMdb(update.title, update.year)).fallback
         }
      }
      return await MovieModel.findByIdAndUpdate(id, movie)
   } catch (e: any) {
      throw new Error(e)
   }
}

export const deleteMovie = async (id: FilterQuery<MovieDoc['_id']>) => {
   try {
      return await MovieModel.findByIdAndDelete(id)
   } catch (e: any) {
      throw new Error(e)
   }
}
