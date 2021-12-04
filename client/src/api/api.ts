import axios from 'axios'
import { Movie } from '@interface/Movie'
import useStore from '@store/useStore'

const url: string = 'http://localhost:4000/api/movies/'

export const fetchPosts = () => axios.get(url)

export const postAll = async (data: Movie[]): Promise<void> => {
   const { actions } = useStore(state => state)
   try {
      const res = await axios.post('http://localhost:4000/api/movies/all-movies', data)
      console.log(res)
      await res.data.error
            ? (actions.fetchFail(), console.log('Post Failed'))
            : (actions.fetchSuccess(res.data), console.log('Post Success'))
   }
   catch {
      actions.fetchFail()
      console.log('post failed')
   }
}
