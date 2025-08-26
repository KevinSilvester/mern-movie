export interface MovieTitle {
   _id: string
   title: string
   poster_uploaded: boolean
   tmdb: {
      found: boolean
      tmdb_id: number | null
      poster_path: string | null
   }
}

export interface Movie {
   _id: string
   title: string
   year: number
   genres: string[]
   directors: string[]
   actors: string[]
   plot: string
   runtime: number
   poster_uploaded: boolean
   tmdb: {
      tmdb_id: number | null
      found: boolean
      budget: number | null
      revenue: number | null
      poster_path: string | null
      backdrop_path: string | null
      imdb_link: string | null
      youtube_link: string | null
   }
   created_at: string
   updated_at: string
}

export type MovieForm = Omit<Movie, '_id' | 'tmdb' | 'created_at' | 'updated_at'> & {
   poster_string: string | undefined
}

export type MovieUpdate = Omit<Movie, 'tmdb'> & {
   poster_string: string
}

export type YearList = number[]

export type ApiResponse<T extends YearList | Movie | Movie[] | MovieTitle[] | string | undefined> =
   | ApiResponseSuccess<T>
   | ApiResponseError

export interface ApiResponseError {
   success: false
   error: {
      type: string
      message: string
   }
}

export interface ApiResponseSuccess<T extends YearList | Movie | Movie[] | MovieTitle[] | string | undefined> {
   success: true
   data: { payload: T; message: string }
}

export interface SourceMovie {
   id: number
   title: string
   year: string
   runtime: string
   genres: string[]
   director: string
   actors: string
   plot: string
   posterUrl: string
}
export interface Store {
   loaded: boolean
   error: boolean
   movies: Movie[] | null
   modalOpen: boolean
   movie: Movie | null
   searchQuery: string
   actions: {
      fetchSuccess: (data: Movie[]) => void
      fetchFail: () => void
      modalOpen: (movie: Movie) => void
      modalClose: () => void
      updateSearchQuery: (query: string) => void
   }
}
