import { useState, useEffect } from 'react'

const useDebounce = <T>(value: T, delay: number) => {
   const [debounceValue, setDebounceValue] = useState<T>(value)

   useEffect(() => {
      const timoutId = setTimeout(() => {
         setDebounceValue(value)
      }, delay)

      return () => clearTimeout(timoutId)
   })

   return debounceValue
}

export default useDebounce
