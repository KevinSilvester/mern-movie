import type { NavigateOptions } from 'react-router-dom'
import { useRef, useMemo, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'

type SetURLSearchParams = (
   nextInit?: ParsedParams | ((prev: ParsedParams) => ParsedParams),
   navigateOpts?: NavigateOptions
) => void

type ParsedParams = {
   [key: string]: number[] | string[] | boolean[] | number | string | boolean | undefined
}

function qsParse(param: string) {
   return queryString.parse(param, { arrayFormat: 'bracket', parseNumbers: true }) as ParsedParams
}

function qsStringify(param: ParsedParams) {
   return queryString.stringify(param, { arrayFormat: 'bracket', skipNull: true })
}

function getSearchParamsForLocation(locationSearch: string, defaultSearchParams: ParsedParams) {
   if (typeof defaultSearchParams === 'function') return {}

   const parsedQs = qsParse(locationSearch)

   Object.keys(defaultSearchParams).forEach(key => {
      if (!parsedQs[key]) {
         parsedQs[key] = defaultSearchParams[key]
      }
   })

   return parsedQs
}

function useSearchParams(defaultInint?: ParsedParams): [ParsedParams, SetURLSearchParams] {
   const defaultParsedQsRef = useRef(defaultInint ? defaultInint : {})

   const location = useLocation()
   const navigate = useNavigate()

   const searchParams = useMemo(
      () => getSearchParamsForLocation(location.search, defaultParsedQsRef.current),
      [location.search]
   ) as ParsedParams

   const setSearchParams = useCallback<SetURLSearchParams>(
      (nextInit, navigateOpts) => {
         const newSearchParams =
            typeof nextInit === 'function' ? qsStringify(nextInit(searchParams)) : nextInit ? qsStringify(nextInit) : ''
         navigate('?' + newSearchParams, navigateOpts)
      },
      [navigate, searchParams]
   )

   return [searchParams, setSearchParams]
}

export default useSearchParams
