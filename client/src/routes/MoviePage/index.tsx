import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getMovie } from '@lib/api'
import _404Page from '@routes/_404Page'
import { PageProvider } from './PageContext'
import MainHeader from './MainHeader'
import MainContent from './MainContent'
import Nav from '@comp/Nav/Nav'

const MoviePage: React.FC = () => {
   const { id } = useParams()

   const { isError, data } = useQuery(['movie', id], () => getMovie(id as string), {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0
   })

   if (isError) {
      return <_404Page />
   }

   return (
      <PageProvider>
         <Nav />
         <main className='px-6 h-auto w-full'>
            <MainHeader movie={data?.movie} />
            <MainContent movie={data?.movie} />
         </main>
      </PageProvider>
   )
}

export default MoviePage
