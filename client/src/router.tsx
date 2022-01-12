// import { lazy } from 'react'
// import {  Route, ReactLocation, Navigate } from 'react-location'
// import Loader from '@comp/Loader'
// import { QueryClient } from 'react-query'
// import { getMovie } from '@lib/api'
// import { ApiResponse } from '@lib/types'


// export 
// export const location = new ReactLocation()

// const HomePage = lazy(() => import('@routes/HomePage'))
// const MoviePage = lazy(() => import('@routes/MoviePage'))
// const FormPage = lazy(() => import('@routes/FormPage'))
// const _404Page = lazy(() => import('@routes/_404Page'))

// export const routes: Route[] = [
//    {
//       path: '/',
//       element: <HomePage />,
//    },
//    {
//       path: 'movie',
//       children: [
//          {
//             path: ':id',
//             element: <MoviePage />,
//             pendingElement: <Loader />,
//             loader: async ({ params: { id }}) => ({
//                movie: queryClient.fetchQuery<ApiResponse['movie']>(['movie', id], () => getMovie(id))
//             })
//          },
//          {
//             path: '/',
//             element: <Navigate to='/' />,
//             pendingElement: <Loader />
//          }
//       ]
//    },
//    {
//       path: 'add',
//       element: <FormPage />,
//       pendingElement: <Loader />
//    },
//    {
//       element: <_404Page />,
//    }
// ]

// // export const history = createBrowserHistory()

export default {}