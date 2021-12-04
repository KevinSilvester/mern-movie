import { useEffect, useState } from 'react'
import axios from 'axios'
import Form from '@comp/Form/Form'
import Card from '@comp/Cards/Cards'
import { Movie } from '@interface/Movie'
import useStore from '@store/useStore'

const App = () => {
   const { loaded, error, movies, actions } = useStore(state => state)

   useEffect(() => {
      axios
         .get('https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json')
         .then(res => res.data.movies.map(({ id, ...rest }: { id: number; rest: Movie }) => rest))
         .then(data => {
            axios
               .post('http://localhost:4000/api/movies/all-movies', data)
               .then(res => {
                  res.data.error
                     ? (actions.fetchFail(), console.log('Post Failed'))
                     : (actions.fetchSuccess(res.data), console.log('Post Success'))
               })
               .catch(() => actions.fetchFail)
         })
         .catch(() => actions.fetchFail)
   }, [])

   return (
      <>
         <h1 className='text-blue-400 text-lg font-bold text-center'>Movie DB</h1>
         <div className='flex gap-3 items-center mt-5 justify-center'>
            {console.log(error)}
            {error || (loaded && movies[0].actors)}
            <Card />
            <Form />
         </div>
      </>
   )
}

export default App
