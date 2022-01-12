import axios from 'axios'
import { ApiResponse, Movie, MovieExtended, SourceData, Store } from '@lib/types'

const API_URL = 'http://localhost:4000/api'
const SOURCE_URL = 'https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json'

export const API = axios.create({ baseURL: API_URL})
export const SOURCE = axios.create({ baseURL: SOURCE_URL })

export const getAllMovies = async () => (await API.get<ApiResponse>('/movie')).data

export const getMovie = async (id: string) => (await API.get<ApiResponse>(`/movie/${id}`)).data

export const resetDB = async () => {
   const { data } = await SOURCE.get<SourceData>('')
   await API.post<ApiResponse>('/movie/reset', data.movies)
}


type DataItem = {
   title: string;
   actors: string;
   posterUrl: string;
}

// export const postMovies = async (): Promise<Movie[]> => {
//    const res = await axios.get(SOURCE_URL)
//    const data = await Promise.all(res.data.movies.map(async ({ title, actors, posterUrl, ...rest}: DataItem, index: number) => {
//       return ({
//          ...rest,
//          title: title,
//          _id: index,
//          actors: actors.split(', '),
//          poster: {
//             url: posterUrl,
//             fallback: await getFallBack(title),
//          }
//       })
//    }))
//    return await (await client.post(`/movie/reset`, data)).data
// }

