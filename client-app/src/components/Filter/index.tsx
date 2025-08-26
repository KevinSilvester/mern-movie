import type { ApiResponse, YearList } from '@lib/types'
import type { TQueryParams } from '@routes/HomePage'
import type { SelectOption } from '@comp/Select'
import { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import produce from 'immer'
import shallow from 'zustand/shallow'
import FilterItem from '@comp/FilterItem'
import Select from '@comp/Select'
import SvgAlphaSortDown from '@comp/Svg/SvgAlphaSortDown'
import SvgAlphaSortUp from '@comp/Svg/SvgAlphaSortUp'
import SvgNumSortDown from '@comp/Svg/SvgNumSortDown'
import SvgNumSortUp from '@comp/Svg/SvgNumSortUp'
import useSearchParams from '@hooks/useSearchParams'
import useStore from '@hooks/useStore'
import { getAllMovies, getYearList } from '@lib/api'
import genres from '@lib/genres'
import { notifyError } from '@lib/toaster'

const arrayToOptions = (arr?: Array<string | number>): SelectOption[] => {
   return arr ? arr.map(i => ({ label: i.toString(), value: i })) : []
}

const sortOptions: SelectOption[] = [
   {
      svg: <SvgAlphaSortDown className='h-3/4' />,
      label: 'Title - Down',
      value: 'T_DOWN'
   },
   {
      svg: <SvgAlphaSortUp className='h-3/4' />,
      label: 'Title - Up',
      value: 'T_UP'
   },
   {
      svg: <SvgNumSortDown className='h-3/4' />,
      label: 'Year - Down',
      value: 'Y_DOWN'
   },
   {
      svg: <SvgNumSortUp className='h-3/4' />,
      label: 'Year - Up',
      value: 'Y_UP'
   }
]

const sortOptionsValue = (sortBy?: 'years' | 'title', sortOrd?: 'asc' | 'desc') => {
   if (!sortBy || sortOrd === undefined) return undefined

   if (sortBy === 'title') {
      if (sortOrd === 'asc') {
         return sortOptions[0]
      } else {
         return sortOptions[1]
      }
   } else {
      if (sortOrd === 'asc') {
         return sortOptions[2]
      } else {
         return sortOptions[3]
      }
   }
}

const Filter: React.FC<{ show: boolean }> = ({ show }) => {
   const { data: res } = useQuery(['years'], getYearList, {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      retry: 1
   })
   const queryClient = useQueryClient()
   const [searchParam, setSearchParam] = useSearchParams()
   const searchYearRef = useRef(useStore.getState().searchYear)
   const searchGenresRef = useRef(useStore.getState().searchGenres)
   const sortByRef = useRef(useStore.getState().sortBy)
   const sortOrderRef = useRef(useStore.getState().sortOrder)
   const selectSortRef = useRef<string | undefined>()
   const [setSearchYear, setSearchGenres, setSortBy, setSortOrder] = useStore(
      state => [state.setSearchYear, state.setSearchGenres, state.setSortBy, state.setSortOrder],
      shallow
   )

   useEffect(() => {
      useStore.subscribe(state => {
         searchYearRef.current = state.searchYear
         searchGenresRef.current = state.searchGenres
         sortByRef.current = state.sortBy
         sortOrderRef.current = state.sortOrder
      })
   }, [])

   const handleChangeMultiChoice = async (options: SelectOption[], key: 'genres' | 'years') => {
      const values = options.map(o => o.value as string)
      const newParam = produce(searchParam, draft => {
         draft[key] = values
      })
      if (key === 'genres') setSearchGenres(values)
      else setSearchYear(values.map(v => Number(v)))
      setSearchParam(newParam)
      await queryClient.fetchQuery(['movies'], () => getAllMovies(newParam as TQueryParams))
   }

   const handleChangeSort = async (option: SelectOption | undefined) => {
      if (selectSortRef.current === option?.value) return

      let newParam = {}
      if (!option) {
         setSortOrder(undefined)
         setSortBy(undefined)
         newParam = produce(searchParam, draft => {
            draft.sort_by = undefined
            draft.sort_order = undefined
         })
      }

      switch (option?.value) {
         case 'T_DOWN':
            setSortOrder('asc')
            setSortBy('title')
            newParam = produce(searchParam, draft => {
               draft.sort_by = 'title'
               draft.sort_order = 'asc'
            })
            break
         case 'T_UP':
            setSortOrder('desc')
            setSortBy('title')
            newParam = produce(searchParam, draft => {
               draft.sort_by = 'title'
               draft.sort_order = 'desc'
            })
            break
         case 'Y_DOWN':
            setSortOrder('asc')
            setSortBy('years')
            newParam = produce(searchParam, draft => {
               draft.sort_by = 'years'
               draft.sort_order = 'asc'
            })
            break
         case 'Y_UP':
            setSortOrder('desc')
            setSortBy('years')
            newParam = produce(searchParam, draft => {
               draft.sort_by = 'years'
               draft.sort_order = 'desc'
            })
            break
      }

      setSearchParam(newParam)
      selectSortRef.current = option?.value as string | undefined
      await queryClient.fetchQuery(['movies'], () => getAllMovies(newParam as TQueryParams))
   }

   const checkYearList = (res?: ApiResponse<YearList>): number[] => {
      if (!res) {
         return []
      }

      if (!res?.success) {
         console.error(res?.error)
         notifyError('Failed to load year list (⊙﹏⊙∥)')
         return []
      }
      return res.data.payload || []
   }

   return (
      <motion.div
         initial={{ height: 0, opacity: 0 }}
         animate={{ height: show ? 80 : 0, opacity: show ? 1 : 0 }}
         transition={{ duration: 0.2, easings: 'backIn' }}
         className='w-full h-20 mt-52 mb-2 px-4 grid grid-cols-[repeat(3,auto)] overflow-auto snap-x snap-mandatory scrollbar-hidden lg:!h-20 lg:!opacity-100 lg:mt-32 lg:flex lg:justify-evenly'
      >
         <FilterItem title='Year'>
            <Select
               options={arrayToOptions(checkYearList(res))}
               value={arrayToOptions(searchYearRef.current)}
               placeholder='Select Years'
               multiple
               onChange={val => handleChangeMultiChoice(val, 'years')}
            />
         </FilterItem>

         <FilterItem title='Genres'>
            <Select
               options={arrayToOptions(genres.map(g => g.value))}
               value={arrayToOptions(searchGenresRef.current)}
               placeholder='Select Genres'
               multiple
               onChange={val => handleChangeMultiChoice(val, 'genres')}
            />
         </FilterItem>

         <FilterItem title='Sort'>
            <Select
               options={sortOptions}
               value={sortOptionsValue(sortByRef.current, sortOrderRef.current)}
               placeholder='Select Sort'
               multiple={false}
               onChange={handleChangeSort}
            />
         </FilterItem>
      </motion.div>
   )
}

export default Filter
