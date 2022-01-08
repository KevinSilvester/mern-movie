import axios from 'axios'
import { Movie, Store } from '@lib/types'

const API_URL = 'http://localhost:4000/api'
const DATA_URL = 'https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json'

export const client = axios.create({ baseURL: API_URL})

export const fetchAll = async (actions: Store['actions']): Promise<void> => {
   try {
      const res = await axios.get(`${API_URL}/all-movies`)
      actions.fetchSuccess(res.data)
   } catch {
      actions.fetchFail()
      console.log('Fetch Failed')
   }
}


export const getFallBack = async (title: string): Promise<string> => {
   try {
      const res = await axios.get(`${API_URL}/external/image/${title.toLowerCase()}`)
      return await res.data.image
   } catch {
      return 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
   }
}


type DataItem = {
   title: string;
   actors: string;
   posterUrl: string;
}

export const postMovies = async (): Promise<Movie[]> => {
   const res = await axios.get(DATA_URL)
   const data = await Promise.all(res.data.movies.map(async ({ title, actors, posterUrl, ...rest}: DataItem, index: number) => {
      return ({
         ...rest,
         title: title,
         _id: index,
         actors: actors.split(', '),
         poster: {
            url: posterUrl,
            fallback: await getFallBack(title),
         }
      })
   }))
   return await (await client.post(`/all-movies`, data)).data
}

