import create from 'zustand'
import { devtools } from 'zustand/middleware'

interface Store {
   searchTitle: string
   searchYear?: number
   searchGenres: string[]
   sortValue?: string
   sortOrder?: -1 | 1
   setSearchTitle: (query: string) => void
   setSearchYear: (query?: number) => void
   setSearchGenres: (query: string[]) => void
   setSortValue: (query?: string) => void
   setSortOrder: (query?: -1 | 1) => void
   resetSearch: () => void
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const useStore = create<Store>(
   devtools(set => ({
      searchTitle: '',
      searchYear: undefined,
      searchGenres: [],
      sortValue: '',
      sortOrder: undefined,
      setSearchTitle: query =>
         set(state => ({
            searchTitle: query
         })),
      setSearchYear: query =>
         set(state => ({
            searchYear: query
         })),
      setSearchGenres: query =>
         set(state => ({
            searchGenres: query
         })),
      setSortValue: query =>
         set(state => ({
            sortValue: query
         })),
      setSortOrder: query =>
         set(state => ({
            sortOrder: query
         })),

      resetSearch: () =>
         set(state => ({
            searchTitle: '',
            searchYear: undefined,
            searchGenres: [],
            sortValue: '',
            sortOrder: undefined
         }))
   }))
)
/* eslint-enable @typescript-eslint/no-unused-vars */

export default useStore
