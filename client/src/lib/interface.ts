import { MakeGenerics } from "react-location"

export interface Movie {
   _id?: number
   actors: string[]
   director: string
   genres: string[]
   plot: string
   poster: {
      url: string
      fallback: string
   }
   title: string
   runtime: string
   year: string
   _v: number
}

interface IteratorYieldResult<MYield> {
   done?: false,
   value: MYield
}

interface IteratorReturnResult<MReturn> {
   done: true,
   value: MReturn
}

type IteratorResult<M, MReturn = any> = IteratorYieldResult<M> | IteratorReturnResult<MReturn>

interface Iterator<M, MReturn = any, MNext = undefined> {
   next(...arg: [] | [MNext]): IteratorResult<M, MReturn>
   return?(value?: MReturn): IteratorResult<M, MReturn>
   throw?(e?: any): IteratorResult<M, MReturn>
}

interface IterableMovie<Movie> {
   [Symbol.iterator]() : Iterator<Movie>
}

export type LocationGeneric = MakeGenerics<{
   LoaderData: {
      movies: Movie[],
      movie: Movie
   }
}>

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