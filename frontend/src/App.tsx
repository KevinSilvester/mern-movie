import { lazy, Suspense, useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

import Loader from '@comp/Loader'
import ErrorPage from '@routes/ErrorPage'
import { notifyInfo, notifyPWA } from '@lib/toaster'

import HomePage, { homeLoader } from '@routes/HomePage'
const MoviePage = lazy(() => import('@routes/MoviePage'))
const FormPage = lazy(() => import('@routes/FormPage'))
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
      ]
   }
])

const App = () => {
   const [updateNow, setUpdateNow] = useState<boolean | undefined>(undefined)

   const {
      offlineReady: [offlineReady, setOfflineReady],
      needRefresh: [needRefresh, setNeedRefresh],
      updateServiceWorker
   } = useRegisterSW({
      onRegisteredSW(swUrl, swReg) {
         console.log(`[Service Worker]: Started at ${swUrl}`)
         if (swReg) {
            // prettier-ignore
            setInterval(() => {
               console.log('[Service Worker]: Checking for updates')
               swReg.update()
            }, 60 * 60 * 12 * 1000)
         }
      },
      onRegisterError(error) {
         console.log('[Service Worker]: Registration Error ', error)
      }
   })

   useEffect(() => {
      if (offlineReady && !needRefresh) {
         notifyInfo('[Service Worker]: App ready to work offline')
      }

      if (offlineReady && needRefresh) {
         const toastId = notifyPWA(setUpdateNow)

         if (updateNow !== undefined) {
            toast.dismiss(toastId)

            if (updateNow) {
               updateServiceWorker(true)
            } else {
               setOfflineReady(false)
               setNeedRefresh(false)
            }
         }
      }
   }, [updateNow, offlineReady, needRefresh])

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
