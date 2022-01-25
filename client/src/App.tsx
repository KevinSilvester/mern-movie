
import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Loader from '@comp/Loader'

import HomePage from '@routes/HomePage'
const MoviePage = lazy(() => import('@routes/MoviePage'))
const FormPage = lazy(() => import('@routes/FormPage'))
const _404Page = lazy(() => import('@routes/_404Page'))

const queryClient = new QueryClient()

const App = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <Suspense fallback={<Loader />}>
               <Routes>
                  <Route index element={<HomePage />} />
                  <Route path='add' element={<FormPage />} />
                  <Route path='edit/:id' element={<FormPage />} />
                  <Route path='movie' element={<Navigate to={'/'} />} />
                  <Route path='movie/:id' element={<MoviePage />} />
                  <Route path='*' element={<_404Page />} />
               </Routes>
            </Suspense>
         </BrowserRouter>
         <ReactQueryDevtools />
      </QueryClientProvider>
   )
}

export default App
