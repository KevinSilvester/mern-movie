
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Router, Outlet } from 'react-location'
import { ReactLocationDevtools } from 'react-location-devtools'

import { routes, location, queryClient } from './router'
import Base from '@layout/Base'
import Loader from '@comp/Loader'


const App = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <Router routes={routes} location={location} defaultPendingElement={<Loader />} defaultPendingMs={1}>
            <Base>
               <Outlet />
            </Base>
            <ReactLocationDevtools position='bottom-right' />
         </Router>
         <ReactQueryDevtools />
      </QueryClientProvider>
   )
}

export default App
