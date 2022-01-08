import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import MovieModel from '../models/movie.model'
import { MovieDoc } from '../types'

/**
 * Deletes all the movies that were in the database and replaces with a new set of movies.
 * @param movies The parsed list of movies
 * @returns The array of inserted movies
 */
export const createAllMovies = async (movies: DocumentDefinition<Omit<MovieDoc, '_id'>>[]) => {
   try {
      await MovieModel.deleteMany({})
      return await MovieModel.insertMany(movies)
   } catch (e: any) {
      throw new Error(e)
   }
}

/**
 * Adds a single movie to DB
 * @param movie Validated new movie from user
 * @returns The movie object if successfully added to DB
 * @throws Mongoose Error
 */
export const createMovie = async (movie: DocumentDefinition<Omit<MovieDoc, '_id'>>) => {
   try {
      return await MovieModel.create(movie)
   } catch (e: any) {
      throw new Error(e)
   }
}

export const findMovie = async (query: FilterQuery<MovieDoc>) => {
   try {
      return await MovieModel.findOne(query)
   } catch (e: any) {
      throw new Error(e)
   }
}

export const searchForMovie = async (query: FilterQuery<MovieDoc>) => {}

export const findAndUpdateMovie = async (
   id: FilterQuery<MovieDoc>,
   update: UpdateQuery<MovieDoc>
) => {
   try {
      return await MovieModel.findByIdAndUpdate(id, update)
   } catch (e: any) {
      throw new Error(e)
   }
}

export const deleteMovie = async (id: FilterQuery<MovieDoc>) => {
   try {
      return await MovieModel.findByIdAndDelete(id)
   } catch (e: any) {
      throw new Error(e)
   }
}
