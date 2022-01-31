import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { Movie, Store } from '@lib/types'

const useStore = create(
   devtools(set => ({
      refresh: false
   }))
)

export default useStore
