import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import SvgLeft from '@comp/Svg/SvgLeft'
import { backToTopVariants } from '@lib/variants'

const BackToTop: React.FC = () => {
   const [visible, setVisible] = useState<boolean>(false)

   const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop
      if (scrolled > 300) {
         setVisible(true)
      } else if (scrolled <= 300) {
         setVisible(false)
      }
   }

   const scrollToTop = () => {
      window.scrollTo({
         top: 0,
         behavior: 'smooth'
      })
   }

   useEffect(() => {
      window.addEventListener('scroll', toggleVisible)
      return () => {
         window.removeEventListener('scroll', toggleVisible)
      }
   }, [])

   return (
      <AnimatePresence>
         {visible && (
            <motion.button
               className='fixed bottom-4 right-5 w-11 h-11 bg-white text-custom-slate-400 grid place-items-center rounded-md shadow-lg shadow-custom-navy-600/30 duration-150 transition-all hover:text-custom-blue-200 dark:bg-custom-navy-400 md:bottom-8 md:right-9 md:w-14 md:h-14'
               onClick={() => scrollToTop()}
               initial={{ y: 10, opacity: 0, pointerEvents: 'none' }}
               animate={{ y: 0, opacity: 1, pointerEvents: 'auto' }}
               exit={{ y: 10, opacity: 0, pointerEvents: 'none' }}
               variants={backToTopVariants}
               transition={{ duration: 0.175 }}
            >
               <SvgLeft className='h-3/5 rotate-90' />
            </motion.button>
         )}
      </AnimatePresence>
   )
}

export default BackToTop
