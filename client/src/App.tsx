import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Loader from '@comp/Loader'

import HomePage from '@routes/HomePage'
import { ToastContainer } from 'react-toastify'
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
                  <Route path='add' element={<FormPage edit={false} />} />
                  <Route path='edit/:id' element={<FormPage edit={true} />} />
                  <Route path='movie' element={<Navigate to={'/'} />} />
                  <Route path='movie/:id' element={<MoviePage />} />
                  <Route path='*' element={<_404Page />} />
               </Routes>
            </Suspense>
            <ToastContainer
               pauseOnFocusLoss={false}
               className='!w-[95vw] md:!w-96 !left-1/2 !-translate-x-1/2 !bottom-7 md:!bottom-10'
            />
         </BrowserRouter>
         <ReactQueryDevtools />
      </QueryClientProvider>
   )
}

export default App
