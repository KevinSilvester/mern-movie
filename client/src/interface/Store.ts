import { Movie } from './Movie'

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