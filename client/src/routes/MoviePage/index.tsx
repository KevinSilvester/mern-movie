/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import React, { useEffect, useRef, useState, createContext, useMemo } from 'react'
import { Link, useParams, useNavigate, useNavigationType } from 'react-router-dom'
import { css, jsx } from '@emotion/react'
import { useQuery } from 'react-query'
import { ToastContainer } from 'react-toastify'
import { getMovie } from '@lib/api'
import _404Page from '@routes/_404Page'
import SvgLeft from '@comp/Svg/SvgLeft'
import { PageProvider } from './PageContext'
import Header from './Header'
import Main from './Main'

const MoviePage: React.FC = () => {
   const { id } = useParams()
   const navigate = useNavigate()
   const navType = useNavigationType()

   const { isFetching, isError, isSuccess, data, refetch } = useQuery(
      ['movie', id],
      () => getMovie(id || ''),
      {
         refetchOnMount: false,
         refetchOnWindowFocus: false,
         retry: 0
      }
   )

   if (isError) {
      return <_404Page />
   }

   return (
      <PageProvider>
         <nav
            role='navigation'
            className='top-0 left-0 w-screen h-20 flex items-center p-6 lg:hidden '
         >
            <button
               role='link'
               aria-label='Go Back'
               className='h-11 w-[77px] rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:w-11'
               //@ts-ignore
               onClick={() => navigate(navType !== 'PUSH' ? '/' : -1)}
            >
               <SvgLeft className='h-1/2' />
            </button>
         </nav>

         <div className='px-6 h-auto w-full'>
            <Header movie={data?.movie} isFetching={isFetching} />
            <Main />
         </div>
         <ToastContainer
            pauseOnFocusLoss={false}
            className='!w-[95vw] md:!w-96 !left-1/2 !-translate-x-1/2 !bottom-4'
         />
      </PageProvider>
   )
}

export default MoviePage
