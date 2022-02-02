/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import { useSearchParams, useNavigate } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from 'react-query'
import shallow from 'zustand/shallow'
import useStore from '@hooks/useStore'
import SvgAdd from '@comp/Svg/SvgAdd'
import SvgSearch from '@comp/Svg/SvgSearch'
import { css, jsx } from '@emotion/react'

const SearchBar: React.FC = () => {
   const navigate = useNavigate()
   const queryClient = useQueryClient()
   const [searchParams, setSearchParams] = useSearchParams()
   const [searchFocus, setSearchFocus] = useState<boolean>(false)
   const [searchTerm, setSearchTerm] = useState<string | null>('')
   const [searchTitle, setSearchTitle] = useStore(state => [state.searchTitle, state.setSearchTitle], shallow)

   const input = useRef<HTMLInputElement>(null)
   const searchStyle = css`
      color: ${searchFocus ? 'hsl(var(--blue-200))  !important' : 'hsl(var(--slate-400))'};
   `

   // useEffect(() => {
   //    if (searchParams.get('title') === null) {
   //       setSearchTitle('')
   //    } else {
   //       setSearchTitle(searchParams.get('title') as string)
   //    }
   // }, [])

   // useEffect(() => {
   //    if (searchTitle.length !== 0)
   //    setSearchParams({ title: searchTitle as string })
   // }, [searchTitle])

   return (
      <form
         role='search'
         aria-label='Search for Movie'
         className='h-11 relative group w-full grid items-center gap-5 grid-cols-[var(--col-2)] rounded-lg bg-custom-white-100 shadow-md dark:shadow-none dark:bg-custom-navy-500 text-custom-slate-400 lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300'
         onSubmit={e => {
            navigate('/')
            e.preventDefault()
            setSearchParams({ title: searchTitle as string })
            queryClient.refetchQueries(['movies'])
         }}
      >
         <SvgSearch
            className='h-1/3 ml-2 transition-all delay-75 duration-150 group-hover:text-custom-blue-200 lg:group-hover:text-custom-slate-200'
            css={searchStyle}
         />
         <input
            id='search'
            type='search'
            autoComplete='off'
            aria-label='Search for Movie'
            aria-multiline='false'
            className='input bg-custom-white-100 dark:bg-custom-navy-500 lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300'
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            onChange={e => setSearchTitle(e.target.value)}
            value={searchTitle as string}
            ref={input}
         />
         <SvgAdd
            role='button'
            focusable={true}
            aria-label='Clear Search Input'
            aria-controls='search'
            className={`h-1/3 -ml-2 rotate-45 transition-all delay-75 duration-150 cursor-pointer ${
               searchFocus ? 'text-custom-blue-200' : 'opacity-0'
            }`}
            onClick={() => {
               setSearchTitle('')
               input.current?.focus()
            }}
         />
      </form>
   )
}

export default SearchBar
