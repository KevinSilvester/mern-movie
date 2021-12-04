import { useEffect, useState } from 'react'
import axios from 'axios'
import Form from '@comp/Form/Form'
import Card from '@comp/Cards/Cards'
import { Movie } from './interface/Movie'
import useMovies from './store/useMovie'

const App = () => {
   const { movies, addAllMovies } = useMovies(state => state)
   const [error, setError] = useState<string>('')

   useEffect(() => {
      axios
         .get('https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json')
         .then(res => res.data.movies.map(({ id, ...rest }: { id: number; rest: Movie }) => rest))
         .then(data => {
            axios.post('http://localhost:4000/api/movies/all-movies', data)
            .then(res => res.data.error ? console.log('Post Failed') : console.log('Post Success'))
            .catch(err => setError(err))
         })
         .catch(err => setError(err))
   }, [])

   return (
      <>
         <h1 className='text-blue-400 text-lg font-bold text-center'>Movie DB</h1>
         <div className='flex gap-3 items-center mt-5 justify-center'>
            <Card />
            <Form />
         </div>
      </>
   )
}

export default App
