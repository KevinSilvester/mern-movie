/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import type { ApiResponse, Movie } from '@lib/types'
import React, { useState, useRef, useMemo, useEffect } from 'react'
import queryString from 'query-string'
import { useQuery, useQueryClient } from 'react-query'
import { Link, ScrollRestoration, useSearchParams } from 'react-router-dom'
import { css, jsx } from '@emotion/react'
import { motion, AnimatePresence } from 'framer-motion'
import SvgSearch from '@comp/Svg/SvgSearch'
import SvgAdd from '@comp/Svg/SvgAdd'
import Card from '@comp/Card'
import Loader from '@comp/Loader'
import SvgUndo from '@comp/Svg/SvgUndo'
import SvgSlider from '@comp/Svg/SvgSlider'
import SvgAdjust from '@comp/Svg/SvgAdjust'
import Modal from '@comp/Modal'
import { getAllMovies, resetDB } from '@lib/api'
import { notifyError, notifySuccess } from '@lib/toaster'
import SvgLeft from '@comp/Svg/SvgLeft'
import BackToTop from '@comp/BackToTop'
import theme from '@lib/theme'
import SearchBar from '@comp/SearchBar'
import useStore from '@hooks/useStore'
import shallow from 'zustand/shallow'
import Filter from '@comp/Filter'

const HomePage: React.FC = () => {
   const [searchParams, setSearchParams] = useSearchParams()
   const [isResetting, setIsResetting] = useState<boolean>(false)
   const [openModal, setOpenModal] = useState<boolean>(false)
   const [showFilter, setShowFilter] = useState<boolean>(false)
   const [searchTitle, setSearchTitle] = useStore(state => [state.searchTitle, state.setSearchTitle], shallow)

   const { isFetching, isError, data, refetch } = useQuery<ApiResponse>(
      ['movies'],
      () => getAllMovies(queryString.stringify({ title: searchTitle })),
      {
         refetchOnMount: false,
         refetchOnWindowFocus: false,
         retry: 0
      }
   )

   const handleCloseModal = async (proceed: boolean) => {
      setOpenModal(false)
      if (proceed) {
         setIsResetting(true)
         await resetDB()
         setIsResetting(false)
         await refetch()
         notifySuccess('Database Reset! ( •̀ ω •́ )✧')
      }
   }

   const MemoizedCards = useMemo(
      () => {
         if (data?.movies?.length === 0) {
            return (
               <div className='absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-28 w-fit text-xl text-center'>
                  No movies found! ≡(▔﹏▔)≡
               </div>
            )
         } else {
            return data?.movies?.map(movie => <Card key={movie._id} movie={movie} />)
         }
      },
      [data?.movies]
   )


   // useEffect(() => {
   //    if (Object.keys(searchParams).length) {
   //       setSearchParams({ title: searchTitle })
   //       console.log(searchParams)
   //       refetch()
   //    }
   //    //
   //    // if (searchTitle.length === 0) {
   //    //    setSearchParams({})
   //    //    refetch()
   //    // }
   //
   // }, [searchTitle])
   //
   // 
   // // useEffect(() => {
   // //    refetch()
   // // }, [searchParams, searchTitle])
   //
   // // useEffect(() => {
   // //    refetch()
   // // }, [searchTitle])

   return (
      <>
         <ScrollRestoration />
         <nav
            role='navigation'
            className='h-[14rem] w-screen absolute top-0 left-1/2 -translate-x-1/2 grid grid-rows-3 z-20 lg:h-[4.5rem] lg:fixed lg:bg-custom-navy-600 dark:lg:bg-custom-navy-400 lg:flex lg:items-center lg:justify-around lg:w-full lg:shadow-lg lg:px-10  2xl:h-[5rem]'
         >
            <div className='h-full w-full grid place-items-center lg:flex lg:items-center lg:justify-center'>
               <Link
                  role='link'
                  aria-label='Link to Home'
                  to='/'
                  onClick={() => setSearchTitle('')}
                  className='text-custom-grey-200 dark:text-custom-blue-200 bg-custom-slate-50 dark:bg-custom-navy-300 font-title font-semibold text-3xl px-2 py-2 my-4 rounded-lg shadow-md lg:bg-custom-navy-500 lg:text-custom-blue-200 dark:lg:bg-custom-navy-300'
               >
                  MovieDB
               </Link>
            </div>
            <div className='w-full h-full grid items-center gap-3 grid-cols-1 px-4 py-0 '>
               <SearchBar />
            </div>
            <div
               role='menu'
               aria-label='Nav Items'
               className='w-full h-full flex gap-4 px-4 justify-around lg:items-center lg:justify-center lg:ml-'
            >
               <Link
                  role='link'
                  aria-label='Add Movie'
                  to='add'
                  className='h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:!w-11'
               >
                  <SvgAdd className='h-1/2' />
               </Link>
               <button
                  role='menuitem'
                  aria-label='Reset Data'
                  aria-haspopup='true'
                  aria-disabled={isFetching}
                  disabled={isFetching}
                  className='h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:!w-11'
                  onClick={() => setOpenModal(true)}
               >
                  <SvgUndo className='h-1/2' />
               </button>
               <button
                  role='menuitem'
                  aria-label='Filter Data'
                  className='lg:hidden h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:!w-11'
                  onClick={() => setShowFilter(!showFilter)}
               >
                  <SvgSlider className='h-1/2' />
               </button>
               <button
                  role='menuitem'
                  aria-label='Change Theme'
                  className='h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:!w-11'
                  onClick={() => theme()}
               >
                  <SvgAdjust className='h-1/2' />
               </button>
            </div>
         </nav>

         <AnimatePresence initial={false}>
            {openModal && (
               <Modal
                  key={1}
                  handleClose={handleCloseModal}
                  title='Reset Database'
                  message='This action will undo any updates/changes you have made to the dataset of movies!'
               />
            )}
            <Filter key={2} show={showFilter} />
         </AnimatePresence>

         <main
            aria-live='assertive'
            aria-busy={isFetching || isResetting}
            role='main'
            className='relative mt-7 mb-10 mx-auto w-[90vw] md:w-[85vw] lg:mt-36 min-h-[40vh]'
         >
            {isError ? (
               <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg'>
                  An Error occurred while loading the Data!
                  <br />
                  Please reload the page to try again!
               </div>
            ) : isFetching ? (
               <Loader />
            ) : (
               <motion.div
                  className={`max-w-[1152px] grid grid-cols-[var(--col-3)] row-span-1 w-full gap-x-2 gap-y-5 justify-center mx-auto md:px-4 md:grid-cols-[var(--col-4)] md:gap-x-4 md:gap-y-7 lg:grid-cols-[var(--col-5)] lg:gap-x-7 lg:gap-y-9 2xl:grid-cols-[var(--col-6)] ${
                     isResetting && 'pointer-events-none'
                  }`}
                  initial={{ '--blur-radius': `${0}px` } as any}
                  animate={{ '--blur-radius': isResetting ? `${4}px` : `${0}px` } as any}
                  transition={{ duration: 0.05, delay: 0.175 }}
                  style={{ filter: 'blur(var(--blur-radius))' }}
               >
                  {MemoizedCards}
               </motion.div>
            )}
            <BackToTop />
         </main>
      </>
   )
}

export default HomePage
