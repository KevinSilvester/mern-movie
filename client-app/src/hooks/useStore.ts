import create from 'zustand'
import { devtools } from 'zustand/middleware'

interface Store {
   searchTitle: string
   searchYear: number[]
   searchGenres: string[]
   sortBy?: 'title' | 'years'
   sortOrder?: 'asc' | 'desc'
   setSearchTitle: (query: string) => void
   setSearchYear: (query: number[]) => void
   setSearchGenres: (query: string[]) => void
   setSortBy: (query?: 'title' | 'years') => void
   setSortOrder: (query?: 'asc' | 'desc') => void
   resetSearch: () => void
   scrollOffset: {
      [locale: string]: {
         x: number
         y: number
      }
   }
   setScrollOffset: (location: string, { x, y }: { x: number; y: number }) => void
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const useStore = create<Store>(
   devtools(set => ({
      searchTitle: '',
      searchYear: [],
      searchGenres: [],
      sortBy: undefined,
      sortOrder: undefined,
      setSearchTitle: query =>
         set(_state => ({
            searchTitle: query
         })),
      setSearchYear: query =>
         set(_state => ({
            searchYear: query
         })),
      setSearchGenres: query =>
         set(_state => ({
            searchGenres: query
         })),
      setSortBy: query =>
         set(_state => ({
            sortBy: query
         })),
      setSortOrder: query =>
         set(_state => ({
            sortOrder: query
         })),

      resetSearch: () =>
         set(_state => ({
            searchTitle: '',
            searchYear: [],
            searchGenres: [],
            sortBy: undefined,
            sortOrder: undefined
         })),

      scrollOffset: {},
      setScrollOffset: (location, { x, y }) =>
         set(state => ({
            scrollOffset: {
               ...state.scrollOffset,
               [location]: { x, y }
            }
         }))
   }))
)
/* eslint-enable @typescript-eslint/no-unused-vars */

export default useStore
