import { StringDecoder } from "string_decoder"

export interface Movie {
   _id: string
   title: string
   year: number
   genres: string[]
   director: string[]
   actors: string[]
   plot: string
   runtime: number
   poster: {
      image: string
      fallback: string
   }
}

export interface MovieExtended extends Movie {
   backdrop: string | null
   links: {
      imdb: string | null
      youtube: string | null
   }

}

export interface ApiResponse {
   success: boolean
   message?: string
   error?: any
   movies?: Movie[]
   movie?: MovieExtended
}

export interface SourceData {
   genres: string[]
   movies: SourceMovie[]
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
   loaded: boolean;
   error: boolean;
   movies: Movie[] | null;
   modalOpen: boolean;
   movie: Movie | null;
   searchQuery: string;
   actions: {
      fetchSuccess: (data: Movie[]) => void;
      fetchFail: () => void;
      modalOpen: (movie: Movie) => void;
      modalClose: () => void;
      updateSearchQuery: (query: string) => void;
   };
}
