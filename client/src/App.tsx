import { useEffect, useState, lazy, Suspense } from 'react'

import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Router, Outlet, useRouter } from 'react-location'
import { ReactLocationDevtools } from 'react-location-devtools'
import { routes, location, queryClient } from './router'

import useStore from '@store/useStore'
import * as api from '@lib/api'
import { Movie } from '@lib/interface'
import Layout from '@layout/Layout'
import Loader from '@comp/Loader'

// import { BrowserRouter, Routes, Route } from 'react-router-dom'



// const Home = lazy(() => import('@routes/Home'))
// const SingleMovie = lazy(() => import('@routes/SingleMovie'))
// const AddMovie = lazy(() => import('@routes/AddMovie'))
// const _404Page = lazy(() => import('@routes/_404Page'))




const App = () => {
   // const { loaded, error, movies, actions } = useStore(state => state)

   // useEffect(() => {
   //    const res = await api.postAllMovies()
   // }, [])

   // return (
   //    <QueryClientProvider client={queryClient}>
   //       <BrowserRouter>
   //          <Layout>
   //             <ReactQueryDevtools />
   //             <Suspense fallback={<Loader />}>
   //                <Routes>
   //                   <Route path='/' element={<Home />} />
   //                   <Route path='movie/:id' element={<SingleMovie />} />
   //                   <Route path='add-movie' element={<AddMovie />} />
   //                   <Route path='*' element={<_404Page />} />
   //                </Routes>
   //             </Suspense>
   //          </Layout>
   //       </BrowserRouter>
   //    </QueryClientProvider>
   // )

   return (
      <QueryClientProvider client={queryClient}>
         <Router routes={routes} location={location} defaultPendingElement={<Loader />} defaultPendingMs={1}>
            <Layout>
               <Outlet />
            </Layout>
            <ReactLocationDevtools position='bottom-right' />
         </Router>
         <ReactQueryDevtools />
      </QueryClientProvider>
   )
}

export default App
