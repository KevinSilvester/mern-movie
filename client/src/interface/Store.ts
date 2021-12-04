import { Movie } from './Movie'

export interface Store {
   loaded: boolean;
   error: boolean;
   movies: Movie[];
   actions: {
      fetchSuccess: (data: Movie[]) => void;
      fetchFail: () => void;
   };
}