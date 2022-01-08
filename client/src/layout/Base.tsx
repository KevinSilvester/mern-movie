import { useEffect, useState } from 'react'
import { Link, useLocation, useRouter, useMatch } from 'react-location'
import { useIsFetching, useQuery } from 'react-query'
import useStore from '@store/useStore'
import SvgSearch from '@comp/Svg/SvgSearch'
import SvgAdd from '@comp/Svg/SvgAdd'
import { Movie } from '@lib/types'
import * as api from '@lib/api'
import Loader from '@comp/Loader'
import NavPrimary from './NavPrimiary'

interface Props {
   children: React.ReactNode;
}

const Base = ({ children }: Props) => {
   // const { actions, movies } = useStore(state => state)
   const location = useLocation()
   const router = useRouter()
   const match = useMatch()

   

   return (
      <>
         <NavPrimary />
         <main className='mt-52 mb-10 mx-auto w-[90vw] lg:mt-36'>
            {children}
         </main>
      </>
   )
}

export default Base
