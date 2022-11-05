import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { usePopper } from 'react-popper'
import { motion, AnimatePresence } from 'framer-motion'
import shallow from 'zustand/shallow'
import produce from 'immer'
import SearchBar from '@comp/SearchBar'
import SvgAdd from '@comp/Svg/SvgAdd'
import SvgAdjust from '@comp/Svg/SvgAdjust'
import SvgLeft from '@comp/Svg/SvgLeft'
import theme from '@lib/theme'
import useStore from '@hooks/useStore'
import useSearchParams from '@hooks/useSearchParams'

const NavSecondary: React.FC = () => {
   const navigate = useNavigate()
   const navType = useNavigationType()

   const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null)
   const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
   const [showPopper, setShowPopper] = useState<boolean>(false)
   const [lastClicked, setLastClicked] = useState<'button' | 'dropdown'>('button')
   const [setSearchTitle, reset] = useStore(state => [state.setSearchTitle, state.resetSearch], shallow)
   const location = useLocation()
   const [searchParams, setSearchParams] = useSearchParams()

   const { styles, attributes } = usePopper(referenceElement, popperElement, {
      modifiers: [{ name: 'offset', options: { offset: [-50, 10] } }]
   })

   const handleSearchChange = (val: string) => {
      setSearchTitle(val)
      setSearchParams(produce(searchParams, draft => {
         draft['title'] = val
      }))
   }

   const handleSearchCancel = () => {
      setSearchTitle('')
      setSearchParams(produce(searchParams, draft => {
         draft['title'] = ''
      }))
   }

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      navigate(`/${location.search}`)
   }

   return (
      <nav
         role='navigation'
         className='h-20 w-screen absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-around z-20 lg:h-[4.5rem] lg:fixed lg:bg-custom-navy-600 dark:lg:bg-custom-navy-400 lg:shadow-lg lg:px-10  2xl:h-[5rem]'
      >
         {/* back button */}
         <div>
            <button
               role='link'
               aria-label='Go to Home Page'
               className='h-11 w-12 rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:hidden'
               onClick={() => (navType !== 'PUSH' ? navigate(`/${location.search}`) : navigate(-1))}
            >
               <SvgLeft className='h-1/2' />
            </button>
         </div>

         {/* logo */}
         <div className='h-full grid place-items-center lg:flex lg:items-center lg:justify-center lg:w-full'>
            <Link
               role='link'
               aria-label='Link to Home'
               to='/'
               onClick={() => {
                  setSearchParams({})
                  reset()
               }}
               className='text-custom-grey-200 dark:text-custom-blue-200 bg-custom-slate-50 dark:bg-custom-navy-300 font-title font-semibold text-3xl px-2 py-2 my-4 rounded-lg shadow-md lg:bg-custom-navy-500 lg:text-custom-blue-200 dark:lg:bg-custom-navy-300'
            >
               MovieDB
            </Link>
         </div>

         {/* small screen drop down toggle */}
         <div className=' lg:hidden'>
            <button
               role='link'
               ref={setReferenceElement}
               onClick={() => {
                  setLastClicked('button')
                  setShowPopper(!showPopper)
               }}
               onBlur={() => {
                  lastClicked === 'button' && setShowPopper(false)
               }}
               aria-label='Go to Home Page'
               className='h-11 w-12 rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none relative'
            >
               <SvgLeft className={`h-1/2 duration-150 ${showPopper ? 'rotate-90' : '-rotate-90'}`} />
            </button>
         </div>

         {/* search-bar */}
         <div className='w-full h-full items-center gap-3 grid-cols-1 px-4 py-0 hidden lg:grid'>
            <SearchBar onChange={handleSearchChange} onCancel={handleSearchCancel} onSubmit={handleSearchSubmit} />
         </div>

         {/* large screen buttons */}
         <div
            role='menu'
            aria-label='Nav Items'
            className='w-full h-full hidden gap-4 px-4 justify-around items-center lg:flex lg:justify-center'
         >
            <Link
               to={`/add/${location.search}`}
               role='link'
               aria-label='Add Movie'
               className='h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:!w-16'
            >
               <SvgAdd className='h-1/2' />
            </Link>

            <button
               role='menuitem'
               aria-label='Change Theme'
               className='h-11 w-full rounded-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid place-items-center transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300 lg:!w-16'
               onClick={() => theme()}
            >
               <SvgAdjust className='h-1/2' />
            </button>
         </div>

         {/* small screen drop down */}
         <AnimatePresence>
            {showPopper && (
               <motion.div
                  ref={setPopperElement}
                  style={styles.popper}
                  key='popper'
                  {...attributes.popper}
                  className='absolute w-40 z-10'
                  onClick={() => setShowPopper(true)}
                  onMouseEnter={() => setLastClicked('dropdown')}
                  onBlur={() => setShowPopper(false)}
                  onMouseLeave={() => setLastClicked('button')}
                  initial={{ opacity: 0, pointerEvents: 'none', top: -5 }}
                  animate={{ opacity: 1, pointerEvents: 'all', top: 0 }}
                  exit={{ opacity: 0, pointerEvents: 'none', top: -5 }}
                  transition={{ duration: 0.15 }}
               >
                  <div
                     style={styles.arrow}
                     data-popper-arrow
                     className='w-2 h-2 bg-transparent -top-1 before:absolute before:w-full before:h-full before:bg-white before:rotate-45 dark:before:bg-custom-navy-500 before:transition-all before:duration-150'
                  ></div>
                  <Link
                     to={`/add/${location.search}`}
                     role='link'
                     aria-label='Add Movie'
                     className='h-11 w-full rounded-t-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid grid-cols-[1.5rem_auto] items-center justify-start gap-3 transition-all duration-150 shadow-md dark:shadow-none lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300'
                  >
                     <SvgAdd className='h-1/2 ml-2' />
                     <span className='font-bold'>Add Movie</span>
                  </Link>
                  <button
                     role='menuitem'
                     aria-label='Change Theme'
                     className='h-11 w-full rounded-b-lg bg-custom-white-100 dark:bg-custom-navy-500 text-custom-slate-400 hover:text-custom-blue-200 lg:hover:text-custom-slate-200 active:!text-custom-blue-200 grid grid-cols-[1.5rem_auto] items-center justify-start gap-3 transition-all duration-150 shadow-md dark:shadow-lg lg:bg-custom-navy-500 dark:lg:bg-custom-navy-300'
                     onClick={() => theme()}
                  >
                     <SvgAdjust className='h-1/2 ml-2' />
                     <span className='font-bold'>Toggle Theme</span>
                  </button>
               </motion.div>
            )}
         </AnimatePresence>
      </nav>
   )
}

export default NavSecondary
