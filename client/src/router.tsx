import { lazy } from 'react'
import { Router, Route, ReactLocation, Link, useMatch, createBrowserHistory } from 'react-location'
import * as api from '@lib/api'
import Loader from '@comp/Loader'
import { QueryClient } from 'react-query'

// const Home = lazy(() => import('@routes/Home'))
// const SingleMovie = lazy(() => import('@routes/SingleMovie'))
// const AddMovie = lazy(() => import('@routes/AddMovie'))
// const _404Page = lazy(() => import('@routes/_404Page'))

export const queryClient = new QueryClient()
export const location = new ReactLocation()


export const routes: Route[] = [
   {
      path: '/',
      element: () => import('@routes/Home').then(module => <module.default />),
      loader: () =>
         queryClient.getQueryData('movies') ??
         queryClient.fetchQuery('movies', api.postMovies).then(() => ({})),
   },
   {
      path: 'movie',
      children: [
         {
            path: ':id',
            element: () => import('@routes/SingleMovie').then(module => <module.default />),
            pendingElement: <Loader />
         },
         {
            path: '/',
            element: () => import('@routes/_404Page').then(module => <module.default />),
            pendingElement: <Loader />
         }
      ]
   },
   {
      path: 'add-movie',
      element: () => import('@routes/AddMovie').then(module => <module.default />),
      pendingElement: <Loader />
   },
   {
      path: '*',
      element: () => import('@routes/_404Page').then(module => <module.default />),
      pendingElement: <Loader />
   }
]

// export const history = createBrowserHistory()