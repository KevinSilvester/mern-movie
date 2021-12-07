import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { Movie } from '@interface/Movie'
import useStore from '@store/useStore'
import * as api from '@api/api'
import Layout from '@layout/Layout'
import Home from '@pages/Home'
import AllMovies from '@pages/AllMovies'
import _404Page from '@pages/_404Page'

const App = () => {
   const { loaded, error, movies, actions } = useStore(state => state)

   useEffect(() => {
      // axios.get('https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json')
      //    .then(res => res.data.movies.map(({ id, ...rest }: { id: number; rest: Movie }, index: number) => ({...rest, _id: index})))
      //    .then(data => {
      //       axios.post('http://localhost:4000/api/movies/all-movies', data)
      //          .then(res => {
      //             res.data.error
      //                ? (actions.fetchFail(), console.log('Post Failed'))
      //                : (actions.fetchSuccess(res.data), console.log('Post Success'))
      //          })
      //          .catch(() => actions.fetchFail())
      //    })
      //    .catch(() => actions.fetchFail())
      axios
         .get('http://localhost:4000/api/movies/all-movies')
         .then(res => (actions.fetchSuccess(res.data), console.log('Fetch Success')))
         .catch(() => (actions.fetchFail(), console.log('Fetch Failed')))
   }, [])

   return (
      <BrowserRouter>
         <Layout>
            <Routes>
               <Route path='/' element={<Home />} />
               <Route path='all-movies' element={<AllMovies />} />
               <Route path='*' element={<_404Page />} />
            </Routes>
         </Layout>
      </BrowserRouter>
   )
}

export default App
