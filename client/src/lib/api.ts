import type { ApiResponse, Movie, MovieExtended, SourceData, Store, MovieForm } from '@lib/types'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL as string
const SOURCE_URL = 'https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json'

export const API = axios.create({ baseURL: API_URL})
export const SOURCE = axios.create({ baseURL: SOURCE_URL })

export const getAllMovies = async () => (await API.get<ApiResponse>('/movie')).data

export const getMovie = async (id: string) => (await API.get<ApiResponse>(`/movie/${id}`)).data

export const resetDB = async () => {
   const { data } = await SOURCE.get<SourceData>('')
   await API.post<ApiResponse>('/movie/reset', data.movies)
}

export const createMovie = async (movie: MovieForm) =>
   (await API.post<ApiResponse>('/movie', movie)).data 

export const deleteMovie = async (id: string) =>
   (await API.delete<ApiResponse>(`/movie/${id}`)).data

export const updateMovie = async (id: string, movie: MovieForm) => {
   return (await API.put<ApiResponse>(`/movie/${id}`, movie)).data 
}


