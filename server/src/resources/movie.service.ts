import type { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import type { MDBMovie, MDBSearch, MDBVideo, MovieDoc, MovieSource } from '../types'
import axios from 'axios'
import config from 'config'
import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'
import MovieModel from './movie.model'

const MDB_KEY = config.get<number>('mdbKey')
const nanoid = customAlphabet(alphanumeric, 15)

export const getFallBack = async (title: string): Promise<string> => {
   try {
      const res = await axios.get<MDBSearch>(
         `https://api.themoviedb.org/3/search/movie?api_key=${MDB_KEY}&query=${title}&page=1`
      )
      if (res.data.total_results === 0) {
         throw new Error('No poster found')
      }
      return `https://image.tmdb.org/t/p/w500/${res.data.results[0].poster_path}`
   } catch {
      return 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
   }
}

export const resetDb = async (movies: MovieSource[]): Promise<MovieDoc[]> => {
   try {
      const data: DocumentDefinition<MovieDoc>[] = await Promise.all(
         movies.map(
            async ({ id, title, actors, posterUrl, year, runtime, ...rest }, index: number) => ({
               ...rest,
               _id: nanoid(),
               title: title,
               year: parseInt(year),
               actors: actors.split(', '),
               runtime: parseInt(runtime),
               poster: {
                  image: posterUrl,
                  fallback: await getFallBack(title)
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

export const getAllMovies = async () => {
   try {
      return await MovieModel.find()
      // return MovieModel.aggregate().search({
      //    index: 'movie-index',
      //    text: {
      //       query: `{
      //          title: "the ",
      //          genre: "drama"
      //       }`,
      //       path: ['title', 'genres', 'director']
      //    }
      // })
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
      const movie = await MovieModel.findById(id)
      if (!movie?.toObject()) throw new Error('Movie Not Found')
      const movieSearchRes = await axios.get<MDBSearch>(
         `https://api.themoviedb.org/3/search/movie?api_key=${MDB_KEY}&query=${movie?.title}&page=1`
      )
      const movieFullRes = await axios.get<MDBMovie>(
         `https://api.themoviedb.org/3/movie/${movieSearchRes.data.results[0].id}?api_key=${MDB_KEY}`
      )
      const movieVideoRes = await axios.get<MDBVideo>(
         `https://api.themoviedb.org/3/movie/${movieFullRes.data.id}/videos?api_key=${MDB_KEY}&language=en`
      )

      const links = {
         imdb: `https://www.imdb.com/title/${movieFullRes.data.imdb_id}`,
         youtube: `https://www.youtube.com/embed/${movieVideoRes.data.results[0].key}`
      }

      return { ...movie.toObject(), links }
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

