import { Link, useNavigate, useNavigationType } from "react-router-dom"
import SvgLeft from "@comp/Svg/SvgLeft"

const Nav: React.FC = () => {
   const navigate = useNavigate()
   const navType = useNavigationType()

   return (
      <nav
         role='navigation'
         className='top-0 left-0 w-screen h-20 flex items-center p-6 lg:hidden '
      >
         <button
            role='link'
            aria-label='Go to Home Page'
            className='h-11 w-14 rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:w-11'
            //@ts-ignore
            onClick={() => navigate(navType !== 'PUSH' ? '/' : -1)}
         >
            <SvgLeft className='h-1/2' />
         </button>
         <Link
            role='link'
            aria-label='Link to Home'
            to='/'
            className='text-custom-grey-200 dark:text-custom-blue-200 bg-custom-slate-50 dark:bg-custom-navy-300 font-title absolute left-1/2 -translate-x-1/2 font-semibold text-3xl p-2 rounded-lg shadow-md lg:bg-custom-navy-500 lg:text-custom-blue-200 dark:lg:bg-custom-navy-300'
         >
            MovieDB
         </Link>
      </nav>
   )
}

export default Nav