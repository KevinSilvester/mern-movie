import create from 'zustand'
import { Movie } from '@interface/Movie'
import { Store } from '@interface/Store'

const useStore = create<Store>(set => ({
   loaded: false,
   error: false,
   movies: [],
   actions: {
      fetchSuccess: data =>
         set(state => ({
            ...state,
            loaded: true,
            movies: [...data]
         })),
      fetchFail: () =>
         set(state => ({
            ...state,
            loaded: true,
            error: true
         })),
   }
}))

export default useStore
