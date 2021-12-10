import axios from 'axios'
import { Movie } from '@interface/Movie'
import { Store } from '@interface/Store'

const url: string = 'http://localhost:4000/api'

export const fetchAll = async (actions: Store['actions']): Promise<void> => {
   try {
      const res = await axios.get(`${url}/all-movies`)
      actions.fetchSuccess(res.data)
   } catch {
      actions.fetchFail()
      console.log('Fetch Failed')
   }
}

export const postAll = async (actions: Store['actions']): Promise<void> => {
   try {
      const getRes = await axios.get('https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json')
      const data: Movie[] = getRes.data.movies.map(({ id, actors, ...rest }: { id: number; actors: string; rest: Movie },index: number) => ({ ...rest,_id: index,actors: actors.split(', ')}))

      try {
         const postRes = await axios.post(`${url}/all-movies`, data)
         await postRes.data.error
            ? (actions.fetchFail(), console.log('Post Failed'))
            : (actions.fetchSuccess(postRes.data), console.log('Post Success'))
      } catch {
         actions.fetchFail()
      }
   } catch {
      actions.fetchFail()
   }
}

export const getFallBack = async (title: string): Promise<string> => {
   try {
      const res = await axios.get(`${url}/external/image/${title.toLowerCase()}`)
      return await res.data.image
   } catch {
      return 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
   }
}
