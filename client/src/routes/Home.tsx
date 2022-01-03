import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import useStore from '@store/useStore'
import Card from '@comp/Card'
import { Movie } from '@lib/interface'

const Home: React.FC = () => {
   const { movies, loaded, error, searchQuery } = useStore(state => state)
   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
   const [temp, setTemp] = useState<Movie[] | null>(null)

   

   return (
      <div className='relative grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] row-span-1 w-full gap-x-2 gap-y-5 justify-center mx-auto md:px-4 md:grid-cols-[var(--col-4)] md:gap-x-4 md:gap-y-7 lg:grid-cols-[var(--col-5)] lg:gap-x-7 lg:gap-y-9 max-w-[1152px]'>
         {movies?.map(movie => <Card key={movie._id} movie={movie} />)}
      </div>
   )
}

export default Home
