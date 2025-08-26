// import type { ParsedQuery, UrlObject } from 'query-string'
import type { ApiResponse, Movie, /* Store, */ MovieForm, MovieTitle, SourceMovie, YearList } from '@lib/types'
import type { TQueryParams } from '@routes/HomePage'
import axios from 'axios'
import queryString from 'query-string'

export const API_URL = import.meta.env.VITE_API_URL as string
const SOURCE_URL = '/reset.json'

export const API = axios.create({ baseURL: API_URL })
export const SOURCE = axios.create({ baseURL: SOURCE_URL })
export const FALLBACK_POSTER = 'https://mern-movie-posters.kevins.site/no-image-placeholder.png'

export const getAllMovies = async (paramObj: TQueryParams) => {
   const searchParams = queryString.stringify(paramObj, {
      arrayFormat: 'none'
   })
   return (await API.get<ApiResponse<MovieTitle[]>>(`/movie?${searchParams}`)).data
}

export const getMovie = async (id: string) => (await API.get<ApiResponse<Movie>>(`/movie/${id}`)).data

export const resetDB = async () => {
   const { data } = await SOURCE.get<SourceMovie[]>('')
   return (await API.post<ApiResponse<undefined>>('/movie/reset', data)).data
}

export const createMovie = async (movie: MovieForm) => (await API.post<ApiResponse<string>>('/movie', movie)).data

export const deleteMovie = async (id: string) => (await API.delete<ApiResponse<Movie>>(`/movie/${id}`)).data

export const updateMovie = async (id: string, movie: MovieForm) => {
   return (await API.put<ApiResponse<string>>(`/movie/${id}`, movie)).data
}

export const getYearList = async () => (await API.get<ApiResponse<YearList>>('/movie/years')).data
