import create from 'zustand'
import { Movie } from '@interface/Movie'
import { Store } from '@interface/Store'

const useStore = create<Store>(set => ({
   loaded: false,
   error: false,
   movies: null,
   modalOpen: false,
   movie: null,
   searchQuery: '',
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
      modalOpen: movie => 
         set(state => ({
            ...state,
            modalOpen: true,
            movie: movie
         })),
      modalClose: () => 
         set(state => ({
            ...state,
            modalOpen: false,
            movie: null
         })),
      updateSearchQuery: query =>
         set(state => ({
            ...state,
            searchQuery: query
         }))
   }
}))

export default useStore
