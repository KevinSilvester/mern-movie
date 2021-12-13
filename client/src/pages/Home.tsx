import { useEffect, useState } from 'react'
import useStore from '@store/useStore'
import Card from '@comp/Card'
import { Movie } from '@interface/Movie'

const Home: React.FC = () => {
   const { movies, loaded, error, searchQuery } = useStore(state => state)
   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
   const [temp, setTemp] = useState<Movie[] | null>(null)

   useEffect(() => {
      if (searchQuery.length === 0 && loaded) setTemp(movies)
      // @ts-ignore
      movies && setTemp([...movies?.filter(movie => movie.title.toLowerCase().match(new RegExp(searchQuery)))])
   }, [searchQuery, loaded])

   return (
      <div className='relative grid grid-cols-[var(--col-3)] row-span-1 w-full gap-x-2 gap-y-5 justify-center mx-auto md:px-4 md:grid-cols-[var(--col-4)] md:gap-x-4 lg:grid-cols-[var(--col-5)] lg:gap-x-7 max-w-[1152px]'>
         {error || loaded && temp?.map(movie => <Card movie={movie} />)}
      </div>
   )
}

export default Home
