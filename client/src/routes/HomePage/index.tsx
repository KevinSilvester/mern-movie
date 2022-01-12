/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import React, { useState, useRef } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { css, jsx } from '@emotion/react'
import SvgSearch from '@comp/Svg/SvgSearch'
import SvgAdd from '@comp/Svg/SvgAdd'
import Card from '@comp/Card'
import Loader from '@comp/Loader'
import SvgUndo from '@comp/Svg/SvgUndo'
import SvgSlider from '@comp/Svg/SvgSlider'
import SvgAdjust from '@comp/Svg/SvgAdjust'
import ResetModal from '@comp/ResetModal'
import { ApiResponse, Movie } from '@lib/types'
import { getAllMovies, resetDB } from '@lib/api'

const HomePage: React.FC = () => {
   const [searchFocus, setSearchFocus] = useState<boolean>(false)
   const [isRefetching, setIsRefetching] = useState<boolean>(false)
   const [openModal, setOpenModal] = useState<boolean>(false)
   const [searchTerm, setSearchTerm] = useState<string>('')
   const input = useRef<HTMLInputElement>(null)

   const { isFetching, isError, isSuccess, data, refetch } = useQuery<ApiResponse>(
      'movies',
      getAllMovies,
      {
         refetchOnMount: false,
         refetchOnWindowFocus: false,
         retry: 0
      }
   )

   const handleCloseModal = async (proceed: boolean) => {
         setOpenModal(false)
         if (proceed) {
            setIsRefetching(true)
            await resetDB()
            setIsRefetching(false)
            await refetch()
         }
   }

   const searchStyle = css`
      color: ${searchFocus ? 'hsl(var(--blue-200))  !important' : 'hsl(var(--slate-400))'};
   `

   const clearStyle = css`
      color: ${searchFocus ? 'hsl(var(--blue-200))  !important' : 'hsl(var(--slate-400))'};
   `

   return (
      <>
         <nav className='h-[14rem] w-screen absolute top-0 left-1/2 -translate-x-1/2 grid grid-rows-3 z-20 lg:h-[4.5rem] lg:fixed lg:bg-custom-navy-600 dark:lg:bg-custom-navy-400 lg:flex lg:items-center lg:justify-around lg:w-full lg:shadow-lg lg:px-10  2xl:h-[5rem]'>
            <div className='h-full w-full grid place-items-center lg:flex lg:items-center lg:justify-center'>
               <Link
                  to='/'
                  className='text-custom-grey-200 dark:text-custom-blue-200 bg-custom-slate-50 dark:bg-custom-navy-300 font-title font-semibold text-3xl px-2 py-2 my-4 rounded-lg shadow-center lg:bg-custom-navy-500 lg:text-custom-blue-200 dark:lg:bg-custom-navy-300'
               >
                  MovieDB
               </Link>
            </div>
            <div className='w-full h-full grid items-center gap-3 grid-cols-1 px-4 py-0 '>
               <form
                  className='h-11 relative group w-full grid items-center gap-5 grid-cols-[var(--col-2)] rounded-lg bg-custom-white-100 shadow-sm dark:shadow-none dark:bg-custom-navy-500 text-custom-slate-400 lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300'
                  onSubmit={e => e.preventDefault()}
               >
                  <SvgSearch
                     className='h-1/3 ml-2 transition-all delay-75 duration-150 group-hover:text-custom-grey-200 dark:group-hover:text-custom-slate-200 lg:group-hover:text-custom-slate-200'
                     css={searchStyle}
                  />
                  <input
                     type='text'
                     className='bg-custom-white-100 dark:bg-custom-navy-500 outline-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300'
                     onFocus={() => setSearchFocus(true)}
                     onBlur={() => setSearchFocus(false)}
                     onChange={e => setSearchTerm(e.target.value)}
                     value={searchTerm}
                     ref={input}
                  />
                  <SvgAdd
                     className={`h-1/3 -ml-2 rotate-45 transition-all delay-75 duration-150 cursor-pointer ${
                        searchFocus ? 'text-custom-blue-200' : 'opacity-0'
                     }`}
                     onClick={() => {
                        setSearchTerm('')
                        input.current?.focus()
                     }}
                  />
               </form>
            </div>
            <div className='w-full h-full flex gap-4 px-4 justify-around lg:items-center lg:justify-center lg:ml-'>
               <Link
                  aria-label='Add Movie'
                  to='add'
                  className='h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-grey-200 dark:hover:text-custom-slate-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-sm-blue dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:w-11'
               >
                  <SvgAdd className='h-1/2' />
               </Link>
               <button
                  aria-label='Reset Data'
                  className='h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-grey-200 dark:hover:text-custom-slate-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-sm-blue dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:w-11'
                  onClick={() => setOpenModal(true)}
                  disabled={isFetching}
               >
                  <SvgUndo className='h-1/2' />
               </button>
               <button
                  aria-label='Filter Data'
                  className='h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-grey-200 dark:hover:text-custom-slate-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-sm-blue dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:w-11'
               >
                  <SvgSlider className='h-1/2' />
               </button>
               <button
                  aria-label='Change Theme'
                  className='h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-grey-200 dark:hover:text-custom-slate-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-sm-blue dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:w-11'
                  onClick={() => {
                     if (localStorage.theme === 'dark') {
                        document.documentElement.classList.remove('dark')
                        localStorage.theme = 'light'
                     } else {
                        document.documentElement.classList.add('dark')
                        localStorage.theme = 'dark'
                     }
                  }}
               >
                  <SvgAdjust className='h-1/2' />
               </button>
            </div>
         </nav>
         <AnimatePresence>
            {openModal && <ResetModal handleClose={handleCloseModal} />}
         </AnimatePresence>
         <main className='mt-56 mb-10 mx-auto w-[90vw] md:w-[85vw] lg:mt-36'>
            {isError ? (
               <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg'>
                  An Error occurred while loading the Data!
                  <br />
                  Please reload the page to try again!
               </div>
            ) : isFetching ? (
               <Loader />
            ) : (
               <div
                  className={`max-w-[1152px] grid grid-cols-[var(--col-3)] row-span-1 w-full gap-x-2 gap-y-5 justify-center mx-auto md:px-4 md:grid-cols-[var(--col-4)] md:gap-x-4 md:gap-y-7 lg:grid-cols-[var(--col-5)] lg:gap-x-7 lg:gap-y-9 2xl:grid-cols-[var(--col-6)] ${
                     isRefetching ? 'blur-sm' : 'blur-none'
                  }`}
               >
                  {data?.movies?.map(movie => (
                     <Card key={movie._id} movie={movie} />
                  ))}
               </div>
            )}
         </main>
      </>
   )
}

export default HomePage
