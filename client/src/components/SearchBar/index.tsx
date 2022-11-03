/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useRef, useState } from 'react'
import { useQueryClient } from 'react-query'
import shallow from 'zustand/shallow'
import Loader from 'react-loader-spinner'
import useStore from '@hooks/useStore'
import SvgAdd from '@comp/Svg/SvgAdd'
import SvgSearch from '@comp/Svg/SvgSearch'
import { css, jsx } from '@emotion/react'

const SearchBar: React.FC<{
   onChange: (e: string) => void
   onSubmit: (e: React.FormEvent) => void
   onCancel: () => void
}> = ({ onChange, onSubmit, onCancel }) => {
   const queryClient = useQueryClient()
   const isLoading = queryClient.isFetching(['movies']) > 0
   const [searchFocus, setSearchFocus] = useState<boolean>(false)
   const [searchTitle, setSearchTitle] = useStore(state => [state.searchTitle, state.setSearchTitle], shallow)
   const input = useRef<HTMLInputElement>(null)
   const searchStyle = css`
      color: ${searchFocus ? 'hsl(var(--blue-200))  !important' : 'hsl(var(--slate-400))'};
   `

   return (
      <form
         role='search'
         aria-label='Search for Movie'
         className='h-11 relative group w-full grid items-center gap-5 grid-cols-[var(--col-2)] rounded-lg bg-custom-white-100 shadow-md dark:shadow-none dark:bg-custom-navy-500 text-custom-slate-400 lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300'
         onSubmit={onSubmit}
      >
         {isLoading ? (
            <div className='h-1/2 ml-2 transition-all delay-75 duration-150 group-hover:text-custom-blue-200 lg:group-hover:text-custom-slate-200 grid place-items-center'>
               <Loader type='Puff' color='#00BFFF' height={20} width={20} />
            </div>
         ) : (
            <SvgSearch
               className='h-1/3 ml-2 transition-all delay-75 duration-150 group-hover:text-custom-blue-200 lg:group-hover:text-custom-slate-200'
               css={searchStyle}
            />
         )}
         <input
            id='search'
            name='search'
            type='search'
            autoComplete='off'
            aria-label='Search for Movie'
            aria-multiline='false'
            className='input bg-custom-white-100 dark:bg-custom-navy-500 lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300'
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            onChange={e => onChange(e.target.value)}
            value={searchTitle}
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
               onCancel()
               input.current?.focus()
            }}
         />
      </form>
   )
}

export default SearchBar
