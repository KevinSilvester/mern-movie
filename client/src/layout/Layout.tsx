import { useEffect, useState } from 'react'
import { Link, useLocation, useRouter } from 'react-location'
import { useIsFetching, useQuery } from 'react-query'
import useStore from '@store/useStore'
import SvgSearch from '@comp/Svg/SvgSearch'
import SvgAdd from '@comp/Svg/SvgAdd'
import { Movie } from '@lib/interface'
import * as api from '@lib/api'
import Loader from '@comp/Loader'
import Nav from './Nav'

const Layout: React.FC = ({ children }) => {
   // const { actions, movies } = useStore(state => state)
   // const location = useLocation()
   const router = useRouter()
   const isFetching = useIsFetching('movies')


   // const { isFetching, isError, data, error } = useQuery<Movie[]>('movies', api.postMovies, { initialData: [] })

   // useEffect(() => {
   //    if (!isError && !isFetching && data)
   //       actions.fetchSuccess(data)
   // }
   // , [data])

   // if (location.current.pathname.includes('add')) {
   //    return (
   //       <>
   //          <main className=''>
   //             {children}
   //          </main>
   //       </>
   //    )
   // }

   // if (isFetching) {
   //    return (
   //       <>
   //          {/* <Loader /> */}
   //          {console.log('fetching')}
   //       </>
   //    )
   // }

   return (
      <>
         {/* {console.log(isFetching)} */}
         <Nav />
         <main className='mt-52 mb-10 mx-auto w-[90vw] lg:mt-36'>
            {children}
         </main>
      </>
   )
}

export default Layout
