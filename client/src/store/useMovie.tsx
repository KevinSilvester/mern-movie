import create from 'zustand'
import { Movie } from './../interface/Movie'

const useMovies = create<{
   movies: Movie[]
   addAllMovies: (data: Movie[]) => void
}>(set => ({
   movies: [],
   addAllMovies: (data: Movie[]) =>
      set(state => ({
         ...state,
         movies: [...data]
      }))
}))

export default useMovies