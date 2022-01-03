import { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import axios from 'axios'
import useStore from '@store/useStore'
import * as api from '@lib/api'
import { Movie } from '@lib/interface'
import Layout from '@layout/Layout'
import Loader from '@comp/Loader'
import Home from '@routes/Home'

const AddMovie = lazy(() => import('@routes/AddMovie'))
const _404Page = lazy(() => import('@routes/_404Page'))

const queryClient = new QueryClient()

const App = () => {
   const { loaded, error, movies, actions } = useStore(state => state)


   // useEffect(() => {
   //    const res = await api.postAllMovies()
   // }, [])

   return (
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <Layout>
               <ReactQueryDevtools />
               <Suspense fallback={<Loader />}>
                  <Routes>
                     <Route path='/' element={<Home />} />
                     <Route path='add-movie' element={<AddMovie />} />
                     <Route path='*' element={<_404Page />} />
                  </Routes>
               </Suspense>
            </Layout>
         </BrowserRouter>
      </QueryClientProvider>
   )
}

export default App
