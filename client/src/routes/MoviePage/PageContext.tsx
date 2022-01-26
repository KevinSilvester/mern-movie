import type { Dispatch, SetStateAction } from 'react'
import React, { useState, useMemo, createContext } from 'react'

export type PageContextType = {
   loaded: boolean
   setLoaded: Dispatch<SetStateAction<boolean>>
}

export const PageContext = createContext<PageContextType>({
   loaded: false,
   setLoaded: () => {}
})

export const PageProvider: React.FC = ({ children }) => {
   const [loaded, setLoaded] = useState<boolean>(false)

   const value = useMemo(() => ({ loaded, setLoaded }), [loaded])

   return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}
