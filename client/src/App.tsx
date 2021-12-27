import { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useStore from '@store/useStore'
import * as api from '@api/api'
import Layout from '@layout/Layout'
import LoadBar from '@comp/Loader'

const Home = lazy(() => import('@routes/Home'))
const AddMovie = lazy(() => import('@routes/AddMovie'))
const _404Page = lazy(() => import('@routes/_404Page'))

const App = () => {
   const { loaded, error, movies, actions } = useStore(state => state)

   useEffect(() => {
      api.postAll(actions)
      // api.fetchAll(actions)
   }, [])

   return (
      <BrowserRouter>
         <Layout>
            <Suspense fallback={<LoadBar />}>
               <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='add-movie' element={<AddMovie />} />
                  <Route path='*' element={<_404Page />} />
               </Routes>
            </Suspense>
         </Layout>
      </BrowserRouter>
   )
}

export default App
