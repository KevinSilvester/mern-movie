import type { Movie } from '@lib/types'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

type SearchQuery = {
   title?: string
   year?: number
   genres?: number
   sort?: string
   sortOrder?: number
}
interface Store {
   searchTitle: string
   searchYear?: number
   searchGenres: string[]
   sortValue: string
   sortOrder?: -1 | 1
   searchQuery: SearchQuery
   resetSearch: () => void
   updateSearchQuery: (newQuery: SearchQuery) => void
   setSearchTitle: (query: string) => void
}

const useStore = create<Store>(
   devtools(set => ({
      searchTitle: '',
      searchYear: undefined,
      searchGenres: [],
      sortValue: '',
      sortOrder: undefined,
      searchQuery: {
         title: undefined,
         year: undefined,
         genres: undefined,
         sort: undefined,
         sortOrder: undefined
      },
      resetSearch: () =>
         set(state => ({
            searchTitle: '',
            searchYear: undefined,
            searchGenres: [],
            sortValue: '',
            sortOrder: undefined
         })),
      updateSearchQuery: newQuery =>
         set(state => ({
            searchQuery: {
               ...state.searchQuery,
               newQuery
            }
         })),
      setSearchTitle: query =>
         set(state => ({
            searchTitle: query
         }))
   }))
)

export default useStore
