/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import type { ApiResponse } from '@lib/types'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { css, jsx } from '@emotion/react'
import { useQuery } from 'react-query'
import { getMovie } from '@lib/api'
import _404Page from '@routes/_404Page'
import Image from '@comp/Image'
import SvgLeft from '@comp/Svg/SvgLeft'
import Warning from '@comp/Warning'
import { loader } from '@lib/styles'
import SvgTrash from '@comp/Svg/SvgTrash'
import SvgEdit from '@comp/Svg/SvgEdit'
import SvgImdb from '@comp/Svg/SvgImdb'

const MoviePage: React.FC = () => {
   const { id } = useParams()
   const navigate = useNavigate()

   const { isFetching, isError, isSuccess, data, refetch } = useQuery(
      ['movie', id],
      () => getMovie(id || ''),
      {
         refetchOnMount: false,
         refetchOnWindowFocus: false,
         retry: 0
      }
   )

   useEffect(() => console.log(isSuccess, isFetching, isError))

   const [loaded, setLoaded] = useState<boolean>(false)
   const [error, setError] = useState<boolean>(false)

   if (isError) {
      return <_404Page />
   }

   return (
      <>
         <nav
            role='navigation'
            className='top-0 left-0 w-screen h-20 flex items-center p-6 lg:hidden'
         >
            {console.log(data)}
            <button
               role='link'
               aria-label='Go Back'
               className='h-11 w-[77px] rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:w-11'
               onClick={() => navigate(-1)}
            >
               <SvgLeft className='h-1/2' />
            </button>
         </nav>

         <main className='px-6 h-auto w-full'>
            <section className='bg-white dark:bg-custom-navy-500 p-3 rounded-md shadow-md dark:shadow-none'>
               <div className=' grid grid-cols-2'>
                  <div className='transition-all rounded-md inline-block relative w-32 z-10 overflow-hidden shadow-custom-navy-600/20 shadow-md-img drop-shadow-xl dark:shadow-none dark:drop-shadow-none aspect-[10/16] bg-white'>
                     {/* <Image
                        title={data?.movie?.title as string}
                        image={data?.movie?.poster.image as string}
                        fallback={data?.movie?.poster.fallback as string}
                     /> */}
                     {error && <Warning />}
                     <img
                        src={data?.movie?.title as string}
                        alt={data?.movie?.poster.image as string}
                        loading='lazy'
                        className='h-full object-cover absolute top-0 left-0 w-full z-0'
                        onLoad={() => setLoaded(true)}
                        onError={e => {
                           e.currentTarget.src = data?.movie?.poster.fallback as string
                           setError(true)
                        }}
                        css={css`
                           opacity: ${!loaded && 0};
                        `}
                     />
                     {(!loaded || isFetching) && (
                        <div
                           className='h-full object-cover absolute top-0 left-0 w-full z-0'
                           css={loader}
                        />
                     )}
                  </div>
                  <span className='text-2xl font-bold'>{data?.movie?.title}</span>
               </div>
               <div className='w-full h-11 flex mt-5 gap-3'>
                  <button className='h-full bg-red-500 w-32 text-white grid place-items-center rounded-md shadow-md dark:shadow-none'>
                     <SvgTrash className='h-1/2' />
                  </button>
                  <button className='h-full bg-custom-blue-200 text-white text-lg font-bold w-full flex items-center justify-center gap-1 rounded-md shadow-md dark:shadow-none'>
                     <SvgEdit className='h-1/2' />
                     <span>Edit</span>
                  </button>
                  <a
                     href={data?.movie?.links.imdb}
                     // disable
                     target='_blank'
                     className='h-full bg-yellow-500 text-black text-lg font-bold w-full flex items-center justify-center gap-1 rounded-md shadow-md dark:shadow-none transition-all hover:!shadow-yellow-400/50 hover:!shadow-md-img'
                  >
                     <SvgImdb className='h-3/5' />
                     <span>IMDb</span>
                  </a>
               </div>
            </section>

            {/* Info block */}
            <section></section>
         </main>
         {/* <div className='h-[50vh] w-screen relative'>
            <div className='h-2/5 bg-white dark:to-custom-navy-300'>
            </div>
            <div className='h-3/5 bg-white dark:bg-custom-navy-300 z-10'>
               <div className='-top-1/4 left-3 transition-all rounded-md inline-block relative w-32 z-10 overflow-hidden shadow-custom-navy-600/20 shadow-md-img drop-shadow-xl dark:shadow-none dark:drop-shadow-none aspect-[10/16] bg-white'>
                  <Image
                     title={data?.movie?.title as string}
                     image={data?.movie?.poster.image as string}
                     fallback={data?.movie?.poster.fallback as string}
                  />
               </div>
            </div>
         </div> */}
      </>
   )
}

export default MoviePage
