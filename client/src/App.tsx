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
      api.postAll(actions)
      // api.fetchAll(actions)
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
