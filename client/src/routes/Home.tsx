import { useQuery, useQueryClient } from 'react-query'
import Card from '@comp/Card'
import Loader from '@comp/Loader'
import { Movie } from '@lib/types'
import { postMovies } from '@lib/api'

const Home: React.FC = () => {
   const {
      isFetching,
      isError,
      isSuccess,
      data: movies
   } = useQuery<Movie[]>('movies', postMovies, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0
   })

   if (isError) {
      return (
         <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg'>
            An Error occurred while loading the Data!
            <br />
            Please reload the page to try again!
         </div>
      )
   }

   return (
      <div className='grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] row-span-1 w-full gap-x-2 gap-y-5 justify-center mx-auto md:px-4 md:grid-cols-[var(--col-4)] md:gap-x-4 md:gap-y-7 lg:grid-cols-[var(--col-5)] lg:gap-x-7 lg:gap-y-9 max-w-[1152px]'>
         {isFetching ? <Loader /> : movies?.map(movie => <Card key={movie._id} movie={movie} />)}
      </div>
   )
}

export default Home
