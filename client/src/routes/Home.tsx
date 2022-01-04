import { useEffect, useState } from 'react'
import { useQuery, useIsFetching, QueryCache, useQueryClient } from 'react-query'
import { useMatch } from 'react-location'
import useStore from '@store/useStore'
import Card from '@comp/Card'
import { LocationGeneric, Movie } from '@lib/interface'
import * as api from '@lib/api'
import Loader from '@comp/Loader'

const Home: React.FC = () => {
   // const { movies, loaded, error, searchQuery } = useStore(state => state)
   // const {
   //    data: movies,
   //    isFetching,
   //    isError
   // } = useQuery<Movie[]>('movies', api.postMovies, {
   //    refetchOnMount: false,
   //    refetchOnWindowFocus: false
   // })

   const queryState = useQueryClient().getQueryState<Movie[]>('movies')

   if (queryState?.status === 'error')
      return (
         <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg'>
            An Error occurred while loading the Data!
            <br />
            Please reload the page to try again!
         </div>
      )

   if (queryState?.status === 'loading') return <Loader />

   return (
      <div className='relative grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] row-span-1 w-full gap-x-2 gap-y-5 justify-center mx-auto md:px-4 md:grid-cols-[var(--col-4)] md:gap-x-4 md:gap-y-7 lg:grid-cols-[var(--col-5)] lg:gap-x-7 lg:gap-y-9 max-w-[1152px]'>
         {queryState?.data?.map((movie) => (
            <Card key={movie._id} movie={movie} />
         ))}
      </div>
   )
}

export default Home
