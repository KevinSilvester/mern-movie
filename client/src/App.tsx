import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Loader from '@comp/Loader'

import HomePage from '@routes/HomePage'
import { ToastContainer } from 'react-toastify'
const MoviePage = lazy(() => import('@routes/MoviePage'))
const FormPage = lazy(() => import('@routes/FormPage'))
const _404Page = lazy(() => import('@routes/_404Page'))

const queryClient = new QueryClient()

const router = createBrowserRouter([
   {
      path: '/',
      index: true,
      element: <HomePage />
   },

   {
      path: 'add',
      element: <FormPage edit={false} />
   },
   {
      path: 'edit/:id',
      element: <FormPage edit={true} />
   },
   {
      path: 'movie',
      element: <Navigate to='/' />
   },
   {
      path: 'movie/:id',
      element: <MoviePage />
   },
   {
      path: '*',
      element: <_404Page />
   }
])

const App = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <Suspense fallback={<Loader />}>
            <RouterProvider router={router} fallbackElement={<Loader />} />
         </Suspense>
         <ToastContainer
            pauseOnFocusLoss={false}
            className='!w-[95vw] md:!w-96 !left-1/2 !-translate-x-1/2 !bottom-7 md:!bottom-10'
         />
         <ReactQueryDevtools />
      </QueryClientProvider>
   )
}

export default App
