import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SvgSearch from './SvgSearch'
import SvgAdd from './SvgAdd'

const Layout: React.FC = ({ children }) => {
   const location = useLocation()
   const [searchFocus, setSearchFocus] = useState<boolean>(false)

   if (location.pathname.includes('add') || location.pathname.includes('add')) {
      return (
         <>
            <main className=''>
               {children}
            </main>
         </>
      )
   }

   return (
      <>
         <nav className='h-[9.5rem] w-screen absolute top-0 left-1/2 -translate-x-1/2 grid grid-rows-2 lg:h-[4.5rem] lg:fixed lg:bg-nav-bg-lg lg:flex lg:items-center lg:justify-between lg:max-w-5xl lg:rounded-xl lg:shadow-lg 2xl:max-w-7xl 2xl:h-[5rem]'>
            <div className='h-full w-full grid place-items-center lg:flex lg:items-center'>
               <Link
                  to='/'
                  className='text-comp-txt-active bg-nav-logo-bg font-title font-semibold text-3xl px-2 py-2 rounded-lg mt-2 shadow-center lg:mt-0 lg:ml-10 lg:bg-comp-bg-lg'
               >
                  MovieDB
               </Link>
            </div>
            <div className='w-full h-full grid items-center gap-4 grid-cols-[var(--col-1)] px-5 py-0 my-5'>
               <div className='h-11 group w-full grid items-center gap-5 grid-cols-[var(--col-2)] rounded-lg bg-comp-bg shadow-center text-comp-txt lg:bg-comp-bg-lg'>
                  <SvgSearch
                     className={`h-1/3 ml-2 transition-all duration-150 group-hover:text-nav-txt ${
                        searchFocus ? '!text-comp-txt-active' : 'text-comp-txt'
                     }`}
                  />
                  <input
                     type='text'
                     className='bg-comp-bg outline-none lg:bg-comp-bg-lg'
                     onFocus={() => setSearchFocus(true)}
                     onBlur={() => setSearchFocus(false)}
                  />
               </div>
               <Link
                  aria-label='Add Movie'
                  to='add'
                  className='h-11 w-11 rounded-lg bg-comp-bg text-comp-txt hover:text-nav-txt active:text-comp-txt-active grid place-items-center shadow-center transition-all duration-150 lg:bg-comp-bg-lg'
               >
                  <SvgAdd className='h-1/2' />
               </Link>
            </div>
         </nav>
         <main className='mt-52 mb-10 mx-auto w-[90vw] lg:mt-36'>
            {children}
         </main>
      </>
   )
}

export default Layout
