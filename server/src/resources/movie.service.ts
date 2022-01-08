import type { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import type { MovieDoc } from '../types'
import MovieModel from './movie.model'

export const resetDb = async (movies: DocumentDefinition<Omit<MovieDoc, '_id'>>[]) => {
   try {
      await MovieModel.deleteMany({})
      return await MovieModel.insertMany(movies)
   } catch (e: any) {
      throw new Error(e)
   }
}

export const getAllMovies = async () => {
   try {
      return await MovieModel.find()
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

export const getMovie = async (id: FilterQuery<MovieDoc['_id']>) => {
   try {
      return await MovieModel.findById(id)
   } catch (e: any) {
      throw new Error(e)
   }
}

export const searchForMovie = async (query: FilterQuery<MovieDoc>) => {}

export const findAndUpdateMovie = async (
   id: FilterQuery<MovieDoc['_id']>,
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
