import { useEffect, useState } from 'react'
import axios from 'axios'
import Form from '@comp/Form/Form'
import Card from '@comp/Cards/Cards'
import { Movie } from './interface/Movie'
import useMovies from './store/useMovie'

const App = () => {
   const { movies, addAllMovies } = useMovies(state => state)

   useEffect(() => {
      axios
         .get('https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json')
         .then(res =>
            res.data.movies.map(({ id, ...rest }: { id: number; rest: Movie }) => rest)
         )
         .then(data => {
            axios.post('http://localhost:4000/movies/all-movies', data).then(res => {
               if (res.data) {
                  if (res.data.errorMessage) {
                     console.log(res.data.errorMessage)
                  } else {
                     console.log('Record added')
                  }
               } else {
                  console.log('Record not added')
               }
            })
         })
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
