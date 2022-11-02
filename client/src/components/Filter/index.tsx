import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from 'react-query'
import { usePopper } from 'react-popper'
import SvgLeft from '@comp/Svg/SvgLeft'
import genres from '@lib/genres'
import useStore from '@hooks/useStore'
import { getYearList } from '@lib/api'
import { ApiResponse } from '@lib/types'

const Filter: React.FC<{ show: boolean }> = ({ show }) => {
   const [yearRef, setYearRef] = useState<HTMLDivElement | null>(null)
   const [yearPopper, setYearPopper] = useState<HTMLDivElement | null>(null)
   const [showYear, setShowYear] = useState<boolean>(false)

   const [genreRef, setGenreRef] = useState<HTMLDivElement | null>(null)
   const [genrePopper, setGenrePopper] = useState<HTMLDivElement | null>(null)
   const [showGenres, setShowGenres] = useState<boolean>(false)

   const [sortRef, setSortRef] = useState<HTMLDivElement | null>(null)
   const [sortPopper, setSortPopper] = useState<HTMLDivElement | null>(null)
   const [showSort, setShowSort] = useState<boolean>(false)

   const { styles: yearStyle, attributes: yearAttributes } = usePopper(yearRef, yearPopper, {
      modifiers: [{ name: 'offset', options: { offset: [0, 5] } }]
   })

   const { styles: genreStyle, attributes: genreAttributes } = usePopper(genreRef, genrePopper, {
      modifiers: [{ name: 'offset', options: { offset: [0, 5] } }]
   })

   const { data } = useQuery<ApiResponse>(['years'], getYearList, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0
   })

   return (
      <>
         <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: show ? 80 : 0, opacity: show ? 1 : 0 }}
            transition={{ duration: 0.2, easings: 'backIn' }}
            className='w-full h-20 mt-52 mb-2 px-4 grid grid-cols-[repeat(3,auto)] overflow-auto scrollbar-hidden gap-x-4 lg:!h-20 lg:!opacity-100 lg:mt-32 lg:flex lg:justify-evenly'
         >
            <div className=' w-48 h-full'>
               <span className='text-xl font-bold py-2'>Year</span>
               <div className='w-full relative'>
                  <div
                     className='relative mt-1 items-center bg-white dark:bg-custom-navy-500 rounded-md shadow-md dark:shadow-none cursor-pointer grid text-base font-semibold grid-cols-[auto_20px] px-4 h-10'
                     ref={setYearRef}
                     onClick={() => setShowYear(!showYear)}
                  >
                     Year
                     <SvgLeft className='h-1/3 -rotate-90 ml-3' />
                  </div>
               </div>
            </div>
            <div className=' w-48 h-full'>
               <span className='text-xl font-bold py-2'>Genres</span>
               <div className='w-full relative'>
                  <div
                     className='mt-1 items-center bg-white dark:bg-custom-navy-500 rounded-md shadow-md dark:shadow-none cursor-pointer grid text-base font-semibold grid-cols-[auto_20px] px-4 h-10'
                     ref={setGenreRef}
                     onClick={() => setShowGenres(!showGenres)}
                  >
                     Genres
                     <SvgLeft className='h-1/3 -rotate-90 ml-3' />
                  </div>
               </div>
            </div>
            <div className=' w-48 h-full'>
               <span className='text-xl font-bold py-2'>Sort</span>
               <div className='w-full relative'>
                  <div className='mt-1 items-center bg-white dark:bg-custom-navy-500 rounded-md shadow-md dark:shadow-none cursor-pointer grid text-base font-semibold grid-cols-[auto_20px] px-4 h-10'>
                     Sort
                     <SvgLeft className='h-1/3 -rotate-90 ml-3' />
                  </div>
               </div>
            </div>
         </motion.div>

         <AnimatePresence>
            {showYear ? (
               <motion.div
                  ref={setYearPopper}
                  style={yearStyle.popper}
                  key='year-popper'
                  {...yearAttributes.popper}
                  initial={{ opacity: 0, pointerEvents: 'none', top: -5 }}
                  animate={{ opacity: 1, pointerEvents: 'all', top: 0 }}
                  exit={{ opacity: 0, pointerEvents: 'none', top: -5 }}
                  transition={{ duration: 0.15 }}
                  className='bg-white dark:bg-custom-navy-500 rounded-md shadow-md left-0 w-44 lg:w-[12rem] z-50 absolute opacity-1'
               >
                  <div className='h-[300px] overflow-auto overscroll-contain p-3'>
                     <div className='whitespace-nowrap flex flex-col'>
                        {data?.yearList?.map(year => (
                           <button
                              key={year}
                              className='py-3 px-3 rounded-md text-base duration-150 hover:bg-slate-100 hover:text-custom-blue-200 dark:hover:bg-custom-navy-100'
                           >
                              <div className='grid grid-cols-[auto_20px]'>
                                 <span className='text-left'>{year}</span>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               </motion.div>
            ) : null}

            {showGenres ? (
               <motion.div
                  ref={setGenrePopper}
                  style={genreStyle.popper}
                  key='genre-popper'
                  {...genreAttributes.popper}
                  initial={{ opacity: 0, pointerEvents: 'none', top: -5 }}
                  animate={{ opacity: 1, pointerEvents: 'all', top: 0 }}
                  exit={{ opacity: 0, pointerEvents: 'none', top: -5 }}
                  transition={{ duration: 0.15 }}
                  className='bg-white dark:bg-custom-navy-500 rounded-md shadow-md left-0 w-44 lg:w-[12rem] z-50 absolute opacity-1'
               >
                  <div className='h-[300px] overflow-auto overscroll-contain p-3'>
                     <div className='whitespace-nowrap flex flex-col'>
                        {genres.map((genre, i) => (
                           <button
                              key={i}
                              className='py-3 px-3 rounded-md text-base duration-150 hover:bg-slate-100 hover:text-custom-blue-200 dark:hover:bg-custom-navy-100'
                           >
                              <div className='grid grid-cols-[auto_20px]'>
                                 <span className='text-left'>{genre.value}</span>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               </motion.div>
            ) : null}
         </AnimatePresence>
      </>
   )
}

export default Filter
