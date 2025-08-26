import type { QueryClient } from 'react-query'
import type { Params } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, useLoaderData, useLocation } from 'react-router-dom'
import { useDebounce } from 'rooks'
import queryString from 'query-string'
import shallow from 'zustand/shallow'
import { AnimatePresence, motion } from 'framer-motion'
import produce from 'immer'
import BackToTop from '@comp/BackToTop'
import Card from '@comp/Card'
import Filter from '@comp/Filter'
import Loader from '@comp/Loader'
import Modal from '@comp/Modal'
import SearchBar from '@comp/SearchBar'
import SvgAdd from '@comp/Svg/SvgAdd'
import SvgAdjust from '@comp/Svg/SvgAdjust'
import SvgSlider from '@comp/Svg/SvgSlider'
import SvgUndo from '@comp/Svg/SvgUndo'
import useSearchParams from '@hooks/useSearchParams'
import useStore from '@hooks/useStore'
import { getAllMovies, resetDB } from '@lib/api'
import theme from '@lib/theme'
import { notifyError, notifySuccess } from '@lib/toaster'

export interface TQueryParams {
   title?: string
   genres?: string[]
   years?: number[]
   sort_by?: 'title' | 'years'
   sort_order?: 'asc' | 'desc'
}

interface TLoaderParam {
   request: Request
   params: Params
}

const getScroll = () => {
   if (typeof window !== 'undefined') {
      return {
         x: window.scrollX,
         y: window.scrollY
      }
   } else {
      const r = document.documentElement
      const b = document.body

      return {
         x: r.scrollLeft || b.scrollLeft || 0,
         y: r.scrollTop || b.scrollTop || 0
      }
   }
}

export const homeLoader =
   (queryClient: QueryClient) =>
   async ({ request }: TLoaderParam) => {
      const url = new URL(request.url)
      const params: TQueryParams = queryString.parse(url.search, {
         arrayFormat: 'bracket',
         parseNumbers: true
      })
      if (!queryClient.getQueryData(['movies'])) {
         await queryClient.fetchQuery(['movies'], () => getAllMovies(params))
      }
      return params
   }

const HomePage: React.FC = () => {
   const params = useLoaderData() as TQueryParams
   const {
      data: res,
      refetch,
      isFetching,
      isError
   } = useQuery(['movies'], () => getAllMovies(params), {
      refetchOnWindowFocus: false,
      retry: 2
   })
   const location = useLocation()
   const [searchParams, setSearchParams] = useSearchParams()
   const [openModal, setOpenModal] = useState<boolean>(false)
   const [isResetting, setIsResetting] = useState<boolean>(false)
   const [showFilter, setShowFilter] = useState<boolean>(false)
   const [
      setSearchTitle,
      setSearchYear,
      setSearchGenres,
      setSortBy,
      setSortOrder,
      reset,
      scrollOffset,
      setScrollOffset
   ] = useStore(
      state => [
         state.setSearchTitle,
         state.setSearchYear,
         state.setSearchGenres,
         state.setSortBy,
         state.setSortOrder,
         state.resetSearch,
         state.scrollOffset,
         state.setScrollOffset
      ],
      shallow
   )
   const debounceSearch = useDebounce(refetch, 300)

   const watchScroll = () => {
      setScrollOffset(getScroll())
   }

   useEffect(() => {
      params.title && setSearchTitle(params.title)
      params.years && setSearchYear(params.years)
      params.genres && setSearchGenres(new Array(0).concat(params.genres))
      params.sort_by && setSortBy(params.sort_by)
      params.sort_order && setSortOrder(params.sort_order)

      document.addEventListener('scroll', watchScroll)

      return () => {
         document.removeEventListener('scroll', watchScroll)
      }
   }, [])

   useEffect(() => {
      if (!isFetching && (scrollOffset.x !== 0 || scrollOffset.y !== 0)) {
         window.scrollTo({
            left: scrollOffset.x,
            top: scrollOffset.y,
            behavior: 'smooth'
         })
      }
   }, [isFetching])

   const resetSearch = async () => {
      reset()
      setSearchParams({})
      debounceSearch()
   }

   const handleCloseModal = async (proceed: boolean) => {
      setOpenModal(false)
      if (!proceed) return
      setIsResetting(true)
      const res = await resetDB()
      setIsResetting(false)

      if (res.success) {
         await resetSearch()
         notifySuccess(res.data.message)
      } else {
         notifyError('Rest Failed! ⊙﹏⊙∥')
      }
   }

   const handleSearchChange = async (val: string) => {
      setSearchTitle(val)
      setSearchParams(
         produce(searchParams, draft => {
            draft.title = val
         })
      )
      debounceSearch()
   }

   const handleSearchCancel = () => {
      setSearchTitle('')
      setSearchParams(
         produce(searchParams, draft => {
            draft.title = ''
         })
      )
      debounceSearch()
   }

   const MemoizedCards = useMemo(() => {
      if (!res?.success) {
         return (
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg'>
               {res?.error?.message || 'An Error occurred while loading the Data!'}
               <br />
               Please reload the page to try again!
            </div>
         )
      }
      if (res?.data.payload?.length === 0) {
         return (
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-28 w-fit text-xl text-center'>
               No movies found! ≡(▔﹏▔)≡
            </div>
         )
      } else {
         return res?.data.payload?.map(movie => <Card key={movie._id} movie={movie} />)
      }
   }, [res])

   return (
      <>
         <nav className='h-[14rem] w-screen absolute top-0 left-1/2 -translate-x-1/2 grid grid-rows-3 z-20 lg:h-[4.5rem] lg:fixed lg:bg-custom-navy-600 dark:lg:bg-custom-navy-400 lg:flex lg:items-center lg:justify-around lg:w-full lg:shadow-lg lg:px-10 lg:z-50 2xl:h-[5rem]'>
            <div className='h-full w-full grid place-items-center lg:flex lg:items-center lg:justify-center'>
               <Link
                  role='link'
                  aria-label='Link to Home'
                  to='/'
                  onClick={resetSearch}
                  className='text-custom-grey-200 dark:text-custom-blue-200 bg-custom-slate-50 dark:bg-custom-navy-300 font-title font-semibold text-3xl px-2 py-2 my-4 rounded-lg shadow-md lg:bg-custom-navy-500 lg:text-custom-blue-200 dark:lg:bg-custom-navy-300'
               >
                  MovieDB
               </Link>
            </div>

            <div className='w-full h-full grid items-center gap-3 grid-cols-1 px-4 py-0 '>
               <SearchBar
                  onChange={handleSearchChange}
                  onSubmit={e => e.preventDefault()}
                  onCancel={handleSearchCancel}
               />
            </div>

            <div
               role='menu'
               aria-label='Nav Items'
               className='w-full h-full flex gap-4 px-4 justify-around lg:items-center lg:justify-center lg:ml-'
            >
               <Link
                  role='link'
                  aria-label='Add Movie'
                  to={`add/${location.search}`}
                  className='h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:!w-11'
               >
                  <SvgAdd className='h-1/2' />
               </Link>
               <button
                  type='button'
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
                  type='button'
                  role='menuitem'
                  aria-label='Filter Data'
                  className='lg:hidden h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:!w-11'
                  onClick={() => setShowFilter(!showFilter)}
               >
                  <SvgSlider className='h-1/2' />
               </button>
               <button
                  type='button'
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
