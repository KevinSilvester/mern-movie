import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { Movie, Store } from '@lib/types'

const useStore = create<Store>(
   devtools(set => ({
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
)

export default useStore
