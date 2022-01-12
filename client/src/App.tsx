
import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const queryClient = new QueryClient()

const HomePage = lazy(() => import('@routes/HomePage'))
const MoviePage = lazy(() => import('@routes/MoviePage'))
const FormPage = lazy(() => import('@routes/FormPage'))
const _404Page = lazy(() => import('@routes/_404Page'))
import Loader from '@comp/Loader'

// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
   document.documentElement.classList.add('dark')
   localStorage.theme = 'dark'
 } else {
   document.documentElement.classList.remove('dark')
   localStorage.theme = 'light'
 }
 


const App = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <Suspense fallback={<Loader />}>
               <Routes>
                  <Route path='/' element={<HomePage />} />
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
