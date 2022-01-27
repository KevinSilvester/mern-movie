/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import type { ApiResponse } from '@lib/types'
import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { css, jsx } from '@emotion/react'
import { useQueryClient, useMutation } from 'react-query'
import { AnimatePresence } from 'framer-motion'
import SvgTrash from '@comp/Svg/SvgTrash'
import SvgEdit from '@comp/Svg/SvgEdit'
import SvgImdb from '@comp/Svg/SvgImdb'
import Modal from '@comp/Modal'
import Image from '@comp/Image'
import { deleteMovie } from '@lib/api'
import { notifyError, notifySuccess } from '@lib/toaster'
import { loader } from '@lib/styles'
import { PageContext } from './PageContext'
import waves from '@assets/wave.svg'


const MainHeader: React.FC<{ movie: ApiResponse['movie'] }> = ({ movie }) => {
   const { loaded } = useContext(PageContext)
   const [openModal, setOpenModal] = useState<boolean>(false)
   const [disable, setDisable] = useState<boolean>(false)

   const navigate = useNavigate()
   const queryClient = useQueryClient()
   const { isSuccess, isError, mutate, data } = useMutation(() => deleteMovie(movie?._id as string))

   const headerSection = css`
      background-color: ${!movie?.backdrop && 'hsl(var(--navy-500))'};
      background-image: ${movie?.backdrop ? `url(${movie?.backdrop})` : `url(${waves})`};
   `

   const headerSectionDiv = css`
      background-image: ${movie?.backdrop &&
      'linear-gradient(180deg, hsl(var(--navy-500) / 0.5) 0%, hsl(var(--navy-500) / 0.9) 73%)'};
   `

   const imdbLink = css`
      opacity: 0.5;
      :hover {
         box-shadow: none !important;
      }
   `

   const handleSuccess = useCallback(async () => {
      setDisable(true)
      notifySuccess(data?.message as string, {
         hideProgressBar: false,
         progressClassName: '!bg-green-400',
         autoClose: 3000
      })
      await queryClient.refetchQueries(['movies'], { exact: true })
      queryClient.removeQueries(['movie', movie?._id], { exact: true })
      setTimeout(() => navigate('/'), 3500)
   }, [movie])

   const handleCloseModal = useCallback(async (proceed: boolean) => {
      setOpenModal(false)
      proceed && mutate()
   }, [movie])

   useEffect(() => {
      isSuccess && handleSuccess()
      isError && notifyError('Delete failed X﹏X')
   }, [isSuccess, isError])

   return (
      <section
         className='relative bg-cover bg-center bg-no-repeat to-white p-3 rounded-md shadow-lg dark:shadow-none'
         css={headerSection}
      >
         <div
            className={`absolute top-0 left-0 z-0 h-full w-full rounded-md `}
            css={headerSectionDiv}
         ></div>
         <div className='relative grid grid-cols-2 z-10'>
            <div className='transition-all rounded-md inline-block relative w-32 z-10 overflow-hidden shadow-custom-navy-600/20 shadow-md-img drop-shadow-xl dark:shadow-none dark:drop-shadow-none aspect-[10/16] bg-white'>
               <Image
                  title={movie?.title as string}
                  image={movie?.poster.image as string}
                  fallback={movie?.poster.fallback as string}
                  context={PageContext}
               />
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
         <div className='relative w-full h-9 flex mt-5 gap-4 z-0'>
            <button
               aria-label='Delete Movie'
               role='button'
               disabled={disable}
               className='h-full bg-red-500 w-32 text-white grid place-items-center rounded-md shadow-md dark:shadow-none transition-all hover:!shadow-red-400/50 hover:!shadow-button'
               onClick={() => setOpenModal(true)}
            >
               <SvgTrash className='h-1/2' />
            </button>
            <Link
               to={`/edit/${movie?._id}`}
               aria-label='Edit Movie Data'
               role='button'
               className='h-full bg-custom-blue-200 text-white text-md font-bold w-full flex items-center justify-center gap-1 rounded-md shadow-md dark:shadow-none transition-all hover:!shadow-custom-blue-200/50 hover:!shadow-button'
            >
               <SvgEdit className='h-1/2' />
               <span>Edit</span>
            </Link>
            <a
               aria-label='Link to IMDb Page'
               role='link'
               href={movie?.links.imdb as string}
               target='_blank'
               className='h-full bg-yellow-500 text-black text-md font-bold w-full flex items-center justify-center gap-1 rounded-md shadow-md dark:shadow-none transition-all hover:!shadow-yellow-400/50 hover:!shadow-button'
               onClick={() => !movie?.links.imdb && notifyError('IMDb link not found!')}
               css={!movie?.links.imdb && imdbLink}
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

export default MainHeader
