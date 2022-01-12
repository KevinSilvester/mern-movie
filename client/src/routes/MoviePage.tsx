import { Link, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getMovie } from '@lib/api'
import { ApiResponse } from '@lib/types'
import { useEffect } from 'react'
import _404Page from './_404Page'

const MoviePage: React.FC = () => {
   const { id } = useParams()

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
      <>
         <div className='h-[50vh] w-screen relative'>
            <div className='h-1/2'>
               
            </div>
            <div></div>
         </div>
      </>
   )
}

export default MoviePage
