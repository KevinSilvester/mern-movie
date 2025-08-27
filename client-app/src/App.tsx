import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Loader from '@comp/Loader'
import ErrorPage from '@routes/ErrorPage'
import HomePage, { homeLoader } from '@routes/HomePage'

const MoviePage = lazy(() => import('@routes/MoviePage'))
const AddPage = lazy(() => import('@routes/FormPages/AddPage'))
const EditPage = lazy(() => import('@routes/FormPages/EditPage'))
const _404Page = lazy(() => import('@routes/_404Page'))

const queryClient = new QueryClient()

const router = createBrowserRouter([
   {
      path: '/',
      errorElement: <ErrorPage />,
      children: [
         {
            index: true,
            element: <HomePage />,
            loader: homeLoader(queryClient)
         },
         {
            path: 'add',
            element: <AddPage /* edit={false} */ />
         },
         {
            path: 'edit/:id',
            element: <EditPage /* edit={true} */ />
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
      ]
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
