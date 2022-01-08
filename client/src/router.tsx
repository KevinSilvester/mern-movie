import {  Route, ReactLocation, Navigate } from 'react-location'
import Loader from '@comp/Loader'
import { QueryClient } from 'react-query'


export const queryClient = new QueryClient()
export const location = new ReactLocation()


export const routes: Route[] = [
   {
      path: '/',
      element: () => import('@routes/Home').then(module => <module.default />),
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
            element: <Navigate to='/' />,
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
      element: () => import('@routes/_404Page').then(module => <module.default />),
   }
]

// export const history = createBrowserHistory()