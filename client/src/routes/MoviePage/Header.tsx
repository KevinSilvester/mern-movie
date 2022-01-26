/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import type { ApiResponse } from '@lib/types'
import React, { useState, useContext } from 'react'
import { css, jsx } from '@emotion/react'
import { toast, Slide } from 'react-toastify'
import { PageContext } from './PageContext'
import Warning from '@comp/Warning'
import { loader } from '@lib/styles'
import SvgTrash from '@comp/Svg/SvgTrash'
import SvgEdit from '@comp/Svg/SvgEdit'
import SvgImdb from '@comp/Svg/SvgImdb'
import waves from '@assets/wave.svg'

type Props = {
   movie: ApiResponse['movie']
    isFetching: boolean
}

const Header: React.FC<Props> = ({ movie, isFetching }) => {
   const { loaded, setLoaded } = useContext(PageContext)

   const [error, setError] = useState<boolean>(false)

   const headerSection = css`
   background-color: ${!movie?.backdrop && 'hsl(var(--navy-500))'};
   background-image: ${movie?.backdrop
      ? `url(${movie?.backdrop})`
      : `url(${waves})`};
   `

   const headerSectionDiv = css`
      background-image: ${movie?.backdrop &&
      'linear-gradient(180deg, hsl(var(--navy-500) / 0.5) 0%, hsl(var(--navy-500) / 0.9) 73%)'};
   `

   const notify = (message: string) =>
      toast.error(message, {
         position: 'bottom-center',
         autoClose: 3500,
         hideProgressBar: true,
         closeOnClick: true,
         pauseOnHover: false,
         draggable: true,
         progress: undefined,
         theme: 'colored',
         transition: Slide,
         className: '!rounded-md shadow-md !mb-1 lg:!mb-2 !h-14 !min-h-0 !bg-red-50 !text-red-400'
      })


   return (
      <header
         className='relative bg-cover bg-center bg-no-repeat to-white p-3 rounded-md shadow-lg dark:shadow-none'
         css={headerSection}
      >
         <div
            className={`absolute top-0 left-0 z-0 h-full w-full rounded-md `}
            css={headerSectionDiv}
         ></div>
         <div className='relative grid grid-cols-2 z-10'>
            <div className='transition-all rounded-md inline-block relative w-32 z-10 overflow-hidden shadow-custom-navy-600/20 shadow-md-img drop-shadow-xl dark:shadow-none dark:drop-shadow-none aspect-[10/16] bg-white'>
               {error && <Warning />}
               <img
                  src={movie?.poster.image as string}
                  alt={movie?.title as string}
                  loading='lazy'
                  className='h-full object-cover absolute top-0 left-0 w-full z-0'
                  onLoad={() => setLoaded(true)}
                  onError={e => {
                     e.currentTarget.src = movie?.poster.fallback as string
                     notify('Poster image link is broken!')
                     setError(true)
                  }}
                  css={css`
                     opacity: ${!loaded && 0};
                  `}
               />
               {!loaded && (
                  <div
                     className='h-full object-cover absolute top-0 left-0 w-full z-0'
                     css={loader}
                  />
               )}
            </div>
            <span
               className={`relative text-left text-2xl font-bold text-white mt-5 break-words ${
                  loaded ? 'w-fit h-fit' : 'h-7 w-full overflow-hidden rounded-lg'
               }`}
               css={loaded || loader}
            >
               {movie?.title}
            </span>
         </div>
         <div className='relative w-full h-10 flex mt-5 gap-4 z-0'>
            <button className='h-full bg-red-500 w-32 text-white grid place-items-center rounded-md shadow-md dark:shadow-none transition-all hover:!shadow-red-400/50 hover:!shadow-button'>
               <SvgTrash className='h-1/2' />
            </button>
            <button className='h-full bg-custom-blue-200 text-white text-lg font-bold w-full flex items-center justify-center gap-1 rounded-md shadow-md dark:shadow-none transition-all hover:!shadow-custom-blue-200/50 hover:!shadow-button'>
               <SvgEdit className='h-1/2' />
               <span>Edit</span>
            </button>
            <a
               href={movie?.links.imdb as string}
               target='_blank'
               className='h-full bg-yellow-500 text-black text-lg font-bold w-full flex items-center justify-center gap-1 rounded-md shadow-md dark:shadow-none transition-all hover:!shadow-yellow-400/50 hover:!shadow-button'
               onClick={() => !movie?.links.imdb && notify('IMDb link not found!')}
               css={css``}
            >
               <SvgImdb className='h-3/5' />
               <span>IMDb</span>
            </a>
         </div>
      </header>
   )
}

export default Header