/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */

import type { Movie } from '@lib/types'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { css, jsx } from '@emotion/react'
import { AnimatePresence } from 'framer-motion'
import waves from '@assets/wave.svg'
import Image from '@comp/Image'
import Modal from '@comp/Modal'
import SvgEdit from '@comp/Svg/SvgEdit'
import SvgImdb from '@comp/Svg/SvgImdb'
import SvgTrash from '@comp/Svg/SvgTrash'
import TextSkeleton from '@comp/TextSkeleton'
import { deleteMovie, FALLBACK_POSTER } from '@lib/api'
import { loader } from '@lib/styles'
import { notifyError, notifySuccess } from '@lib/toaster'
import { nullThenUndefined } from '@lib/utils'

const PageHeader: React.FC<{ movie?: Movie; isFetched: boolean }> = ({ movie, isFetched }) => {
   const [openModal, setOpenModal] = useState<boolean>(false)
   const [disable, setDisable] = useState<boolean>(false)

   const navigate = useNavigate()
   const queryClient = useQueryClient()
   const { isSuccess, isError, mutate, data: res } = useMutation(() => deleteMovie(movie?._id as string))

   const headerSection = css`
      background-color: ${!movie?.tmdb.backdrop_path && 'hsl(var(--navy-500))'};
      background-image: ${movie?.tmdb.backdrop_path ? `url(${movie?.tmdb.backdrop_path})` : `url(${waves})`};
   `

   const headerSectionDiv = css`
      background-image: ${movie?.tmdb.backdrop_path &&
      'linear-gradient(180deg, hsl(var(--navy-500) / 0.5) 0%, hsl(var(--navy-500) / 0.9) 73%)'};
   `

   const imdbLink = css`
      opacity: 0.5;
      :hover {
         box-shadow: none !important;
      }
   `

   const handleSuccess = async () => {
      setDisable(true)

      if (res?.success === false) {
         notifyError(res?.error.message)
         setDisable(false)
         return
      }

      notifySuccess(res?.data.message as string, {
         hideProgressBar: false,
         progressClassName: '!bg-green-400',
         autoClose: 3000,
         pauseOnFocusLoss: false
      })
      await queryClient.refetchQueries(['movies'], { exact: true })
      queryClient.removeQueries(['movie', movie?._id], { exact: true })
      setTimeout(() => navigate('/'), 3500)
   }

   const handleCloseModal = async (proceed: boolean) => {
      setOpenModal(false)
      proceed && mutate()
   }

   useEffect(() => {
      isSuccess && handleSuccess()
      isError && notifyError('Delete failed! X﹏X')
   }, [isSuccess, isError])

   return (
      <section
         className='relative bg-cover bg-center bg-no-repeat p-3 rounded-md shadow-lg dark:shadow-none lg:py-4'
         css={headerSection}
      >
         <div className='absolute top-0 left-0 z-0 h-full w-full rounded-md' css={headerSectionDiv}></div>
         <div className='relative grid grid-cols-[8rem_auto] gap-2 z-10 md:grid-cols-[11rem_auto] md:gap-4 lg:grid-cols-[14rem_auto] lg:px-20 lg:gap-20'>
            <div className='transition-all rounded-md inline-block relative w-full z-10 overflow-hidden shadow-custom-navy-600/20 shadow-md-img drop-shadow-xl dark:shadow-none dark:drop-shadow-none aspect-[10/16] bg-white'>
               {isFetched ? (
                  <Image
                     title={movie?.title as string}
                     src={
                        movie?.poster_uploaded
                           ? `https://moviedb-posters.kevins.site/${movie._id}`
                           : nullThenUndefined(movie?.tmdb.poster_path || null)
                     }
                     fallback={FALLBACK_POSTER}
                  />
               ) : (
                  <div className='h-full object-cover absolute top-0 left-0 w-full z-0' css={loader} />
               )}
            </div>
            {isFetched ? (
               <span
                  className='relative text-left text-3xl font-bold text-white mt-4 w-full h-fit lg:h-8 lg:text-4xl lg:mt-6'
                  style={{ overflowWrap: 'anywhere' }}
               >
                  {movie?.title}
               </span>
            ) : (
               <TextSkeleton className='w-full lg:!w-[24rem] h-7 lg:h-8' />
            )}
         </div>
         <div className='relative w-full h-9 flex mt-5 gap-4 lg:px-20 lg:!w-[28rem] z-20 lg:absolute lg:-translate-y-16 lg:translate-x-[19rem]'>
            <button
               type='button'
               aria-label='Delete Movie'
               disabled={disable}
               aria-disabled={disable}
               className='h-full bg-red-500 w-32 text-white grid place-items-center rounded-md shadow-md dark:shadow-none transition-all hover:!shadow-red-400/50 hover:!shadow-button'
               onClick={() => setOpenModal(true)}
            >
               <SvgTrash className='h-1/2' />
            </button>
            <Link
               to={`/edit/${movie?._id}`}
               aria-label='Edit Movie Data'
               role='link'
               className='h-full bg-custom-blue-200 text-white text-md font-bold w-full flex items-center justify-center gap-1 rounded-md shadow-md dark:shadow-none transition-all hover:!shadow-custom-blue-200/50 hover:!shadow-button'
            >
               <SvgEdit className='h-1/2' />
               <span>Edit</span>
            </Link>
            <a
               aria-label='Link to IMDb Page'
               aria-disabled={!movie?.tmdb.imdb_link}
               rel='noopener noreferrer'
               href={movie?.tmdb.imdb_link as string}
               target='_blank'
               className='h-full bg-yellow-500 text-black text-md font-bold w-full flex items-center justify-center gap-1 rounded-md shadow-md dark:shadow-none transition-all hover:!shadow-yellow-400/50 hover:!shadow-button'
               onClick={() => !movie?.tmdb.imdb_link && notifyError('IMDb link not found!  ㄟ( ▔, ▔ )ㄏ')}
               css={!movie?.tmdb.imdb_link && imdbLink}
            >
               <SvgImdb className='h-3/5' />
               <span>IMDb</span>
            </a>
         </div>
         <AnimatePresence initial={false}>
            {openModal && (
               <Modal
                  handleClose={handleCloseModal}
                  title='Delete Movie'
                  message='Are you sure you want to delete the movie?'
               />
            )}
         </AnimatePresence>
      </section>
   )
}

export default PageHeader
