import type { ApiResponse } from '@lib/types'
import type { TQueryParams } from '@routes/HomePage'
import type { SelectOption } from '@comp/Select'
import { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import shallow from 'zustand/shallow'
import produce from 'immer'
import Select from '@comp/Select'
import FilterItem from '@comp/FilterItem'
import SvgAlphaSortDown from '@comp/Svg/SvgAlphaSortDown'
import SvgAlphaSortUp from '@comp/Svg/SvgAlphaSortUp'
import SvgNumSortDown from '@comp/Svg/SvgNumSortDown'
import SvgNumSortUp from '@comp/Svg/SvgNumSortUp'
import useSearchParams from '@hooks/useSearchParams'
import useStore from '@hooks/useStore'
import genres from '@lib/genres'
import { getAllMovies, getYearList } from '@lib/api'

const arrayToOptions = (arr?: Array<string | number>): SelectOption[] => {
   return arr ? arr.map(i => ({ label: i.toString(), value: i })) : []
}

const sortOptions: SelectOption[] = [
   { svg: <SvgAlphaSortDown className='h-3/4' />, label: 'Title - Down', value: 'T_DOWN' },
   { svg: <SvgAlphaSortUp className='h-3/4' />, label: 'Title - Up', value: 'T_UP' },
   { svg: <SvgNumSortDown className='h-3/4' />, label: 'Year - Down', value: 'Y_DOWN' },
   { svg: <SvgNumSortUp className='h-3/4' />, label: 'Year - Up', value: 'Y_UP' }
]

const sortOptionsValue = (sortVal?: string, sortOrd?: number) => {
   if (!sortVal || sortOrd === undefined) return undefined

   if (sortVal === 'title') {
      if (sortOrd === 1) {
         return sortOptions[0]
      } else {
         return sortOptions[1]
      }
   } else {
      if (sortOrd === 1) {
         return sortOptions[2]
      } else {
         return sortOptions[3]
      }
   }
}

const Filter: React.FC<{ show: boolean }> = ({ show }) => {
   const { data } = useQuery<ApiResponse>(['years'], getYearList, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0
   })
   const queryClient = useQueryClient()
   const [searchParam, setSearchParam] = useSearchParams()
   const searchYearRef = useRef(useStore.getState().searchYear)
   const searchGenresRef = useRef(useStore.getState().searchGenres)
   const sortValueRef = useRef(useStore.getState().sortValue)
   const sortOrderRef = useRef(useStore.getState().sortOrder)
   const selectSortRef = useRef<string | undefined>()
   const [setSearchYear, setSearchGenres, setSortValue, setSortOrder] = useStore(
      state => [state.setSearchYear, state.setSearchGenres, state.setSortValue, state.setSortOrder],
      shallow
   )

   useEffect(() => {
      useStore.subscribe(
         state => (
            (searchYearRef.current = state.searchYear),
            (searchGenresRef.current = state.searchGenres),
            (sortValueRef.current = state.sortValue),
            (sortOrderRef.current = state.sortOrder)
         )
      )
   }, [])

   const handleChangeYear = async (option: SelectOption | undefined) => {
      if (searchYearRef.current === option?.value) return

      const newParam = produce(searchParam, draft => {
         draft['year'] = option ? option.value : undefined
      })

      setSearchParam(newParam)
      if (option !== undefined) {
         setSearchYear(option.value as number)
      } else {
         setSearchYear(undefined)
      }
      await queryClient.fetchQuery(['movies'], () => getAllMovies(newParam as TQueryParams))
   }

   const handleChangeGenre = async (options: SelectOption[]) => {
      const genres = options.map(o => o.value as string)
      const newParam = produce(searchParam, draft => {
         draft['genres'] = genres
      })
      setSearchGenres(genres)
      setSearchParam(newParam)
      await queryClient.fetchQuery(['movies'], () => getAllMovies(newParam as TQueryParams))
   }

   const handleChangeSort = async (option: SelectOption | undefined) => {
      if (selectSortRef.current === option?.value) return

      let newParam = {}
      if (!option) {
         setSortOrder(undefined)
         setSortValue(undefined)
         newParam = produce(searchParam, draft => {
            draft['sort'] = undefined
            draft['sortOrder'] = undefined
         })
      }

      switch (option?.value) {
         case 'T_DOWN':
            setSortOrder(1)
            setSortValue('title')
            newParam = produce(searchParam, draft => {
               draft['sort'] = 'title'
               draft['sortOrder'] = 1
            })
            break
         case 'T_UP':
            setSortOrder(-1)
            setSortValue('title')
            newParam = produce(searchParam, draft => {
               draft['sort'] = 'title'
               draft['sortOrder'] = -1
            })
            break
         case 'Y_DOWN':
            setSortOrder(1)
            setSortValue('year')
            newParam = produce(searchParam, draft => {
               draft['sort'] = 'year'
               draft['sortOrder'] = 1
            })
            break
         case 'Y_UP':
            setSortOrder(-1)
            setSortValue('year')
            newParam = produce(searchParam, draft => {
               draft['sort'] = 'year'
               draft['sortOrder'] = -1
            })
            break
      }

      setSearchParam(newParam)
      selectSortRef.current = option?.value as string | undefined
      await queryClient.fetchQuery(['movies'], () => getAllMovies(newParam as TQueryParams))
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
               options={arrayToOptions(data?.yearList as number[])}
               value={
                  searchYearRef.current
                     ? { label: searchYearRef.current.toString(), value: searchYearRef.current }
                     : undefined
               }
               placeholder='Select Year'
               multiple={false}
               onChange={handleChangeYear}
            />
         </FilterItem>

         <FilterItem title='Genres'>
            <Select
               options={arrayToOptions(genres.map(g => g.value))}
               value={arrayToOptions(searchGenresRef.current)}
               placeholder='Select Genres'
               multiple
               onChange={handleChangeGenre}
            />
         </FilterItem>

         <FilterItem title='Sort'>
            <Select
               options={sortOptions}
               value={sortOptionsValue(sortValueRef.current, Number(sortOrderRef.current))}
               placeholder='Select Sort'
               multiple={false}
               onChange={handleChangeSort}
            />
         </FilterItem>
      </motion.div>
   )
}

export default Filter
