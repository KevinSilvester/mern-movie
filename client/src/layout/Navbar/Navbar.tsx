import { useEffect, useState } from 'react'
import { HomeIcon, FilmIcon } from '@heroicons/react/outline'
import useStore from '@store/useStore'
import NavButton from '@comp/Button/NavButton'
import style from './Navbar.module.css'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
   const location = useLocation()
   const [isHome, setIsHome] = useState<boolean>(location.pathname.includes('movies'))

   useEffect(() => setIsHome(location.pathname.includes('movie')), [location])

   return (
      <>
         <div className='bg-gray-900 fixed bottom-3 h-12 w-[93%] flex left-1/2 transform -translate-x-1/2 rounded-lg shadow-nav'>
               <NavButton active={!isHome} path='/'>
                  <HomeIcon className='h-1/2 text-white' />
               </NavButton>
            
               <NavButton active={isHome} path='/all-movies'>
                  <FilmIcon className='h-1/2 text-white' />
               </NavButton>
         </div>
      </>
   )
}

export default Navbar
