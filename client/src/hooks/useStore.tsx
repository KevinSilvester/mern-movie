import type { Movie, Store } from '@lib/types'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

const useStore = create(
   devtools(set => ({
      query: undefined,
      setQuery: (newQuery: string | undefined) => set(state => ({ query: newQuery }))
   }))
)

export default useStore
