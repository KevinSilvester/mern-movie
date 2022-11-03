import SvgAdd from '@comp/Svg/SvgAdd'
import SvgAdjust from '@comp/Svg/SvgAdjust'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

const Dropdown: React.FC<{ referenceElement: HTMLButtonElement | null }> = ({ referenceElement }) => {
   return (
      <motion.div
         className='absolute w-40 z-10'
         onClick={e => e.stopPropagation()}
         key='popper'
         initial={{
            opacity: 0
         }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.15 }}
      >
         <Link
            role='link'
            aria-label='Add Movie'
            to='/add'
            className='h-11 w-full rounded-t-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid grid-cols-[1.5rem_auto] items-center justify-start gap-3 transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300'
         >
            <SvgAdd className='h-1/2 ml-2' />
            <span className='font-bold'>Add Movie</span>
         </Link>
         <button
            role='menuitem'
            aria-label='Change Theme'
            className='h-11 w-full rounded-b-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid grid-cols-[1.5rem_auto] items-center justify-start gap-3 transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300'
            onClick={() => {
               if (localStorage.theme === 'dark') {
                  document.documentElement.classList.remove('dark')
                  localStorage.theme = 'light'
               } else {
                  document.documentElement.classList.add('dark')
                  localStorage.theme = 'dark'
               }
            }}
         >
            <SvgAdjust className='h-1/2 ml-2' />
            <span className='font-bold'>Toggle Theme</span>
         </button>
         <div></div>
      </motion.div>
   )
}

export default Dropdown
