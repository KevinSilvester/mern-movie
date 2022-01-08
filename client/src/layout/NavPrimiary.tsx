/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import React, { useState } from 'react'
import { Link } from 'react-location'
import { css, jsx } from '@emotion/react'
import SvgSearch from '@comp/Svg/SvgSearch'
import SvgAdd from '@comp/Svg/SvgAdd'

const NavPrimary: React.FC = () => {
   const [searchFocus, setSearchFocus] = useState<boolean>(false)

   const searchStyle = css`
      color: ${searchFocus ? 'hsl(var(--blue-200))  !important' : 'hsl(var(--slate-400))'};
   `

   const clearStyle = css`
      color: ${searchFocus ? 'hsl(var(--blue-200))  !important' : 'hsl(var(--slate-400))'};
   `

   return (
      <>
         <nav className='h-[9.5rem] w-screen absolute top-0 left-1/2 -translate-x-1/2 grid grid-rows-2 z-20 lg:h-[4.5rem] lg:fixed lg:bg-custom-navy-400 lg:flex lg:items-center lg:justify-around lg:w-full lg:shadow-lg lg:px-10  2xl:h-[5rem]'>
            <div className='h-full w-full grid place-items-center lg:flex lg:items-center'>
               <Link
                  to='/'
                  className='text-custom-blue-200 bg-custom-navy-300 font-title font-semibold text-3xl px-2 py-2 rounded-lg mt-2 shadow-center lg:mt-0 lg:ml-10 lg:bg-custom-navy-100'
                  preload={5000}
               >
                  MovieDB
               </Link>
            </div>
            <div className='w-full h-full grid items-center gap-4 grid-cols-[var(--col-1)] px-5 py-0 my-5'>
               <div className='h-11 relative group w-full grid items-center gap-5 grid-cols-[var(--col-2)] rounded-lg bg-custom-navy-500 text-custom-slate-400 lg:bg-custom-navy-100'>
                  <SvgSearch
                     className='h-1/3 ml-2 transition-all duration-150 group-hover:text-custom-slate-200'
                     css={searchStyle}
                  />
                  <input
                     type='text'
                     className='bg-custom-navy-500 outline-none lg:bg-custom-navy-100'
                     onFocus={() => setSearchFocus(true)}
                     onBlur={() => setSearchFocus(false)}
                  />
                  <SvgAdd
                     className={`h-1/3 -ml-2 rotate-45 transition-all duration-150 group-hover:text-custom-slate-200 ${
                        searchFocus ? '!text-custom-blue-200' : 'opacity-0'
                     }`}
                  />
               </div>
               <Link
                  aria-label='Add Movie'
                  to='add-movie'
                  className='h-11 w-11 rounded-lg bg-custom-navy-500 text-custom-slate-400 hover:text-custom-slate-200 active:text-custom-blue-200 grid place-items-center transition-all duration-150 lg:bg-custom-navy-100'
                  preload={5000}
               >
                  <SvgAdd className='h-1/2' />
               </Link>
            </div>
         </nav>
      </>
   )
}

export default NavPrimary
