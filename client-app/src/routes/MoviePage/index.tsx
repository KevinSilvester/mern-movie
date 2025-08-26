import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import NavSecondary from '@comp/NavSecondary'
import { getMovie } from '@lib/api'
import _404Page from '@routes/_404Page'
import PageContent from './PageContent'
import PageHeader from './PageHeader'
import PageIframe from './PageIframe'

const MoviePage: React.FC = () => {
   const { id } = useParams()
   const {
      isError,
      isFetched,
      data: res
   } = useQuery(['movie', id], () => getMovie(id as string), {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0
   })

   useEffect(() => {
      window.scrollTo(0, 0)
   }, [id])

   if (isError) {
      return <_404Page />
   }

   if (isFetched && !res?.success) {
      return (
         <div className='flex items-center justify-center h-96'>
            {console.error(res?.error)}
            <h1 className='text-2xl font-bold text-gray-700'>
               An Error occurred while loading the Movie! Please try again later. (⊙_☉)
            </h1>
         </div>
      )
   }

   return (
      <>
         <NavSecondary />
         <main
            className={`px-5 h-auto w-full md:w-2xl mt-24 mx-auto lg:px-0 lg:w-full lg:max-w-5xl lg:mt-24 lg:mx-auto`}
         >
            <PageHeader movie={res?.success ? res?.data.payload : undefined} isFetched={isFetched} />
            <PageIframe movie={res?.success ? res?.data.payload : undefined} isFetched={isFetched} />
            <PageContent movie={res?.success ? res?.data.payload : undefined} isFetched={isFetched} />
         </main>
      </>
   )
}

export default MoviePage
