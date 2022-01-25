import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

const ResetModal: React.FC<{ handleClose: (proceed: boolean) => Promise<void> }> = ({
   handleClose
}) => {
   const [open, setOpen] = useState<boolean>(true)

   useEffect(() => disableBodyScroll(document.body), [])

   const handleClick = (proceed: boolean) => {
      setOpen(false)
      enableBodyScroll(document.body)
      handleClose(proceed)
   }

   return createPortal(
      <motion.div
         className='fixed top-0 left-0 h-screen w-screen backdrop-blur-sm bg-black/40 dark:bg-black/50 z-50 grid place-items-center'
         key='reset-modal'
         initial={{ opacity: 0, y: -15 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -15 }}
         transition={{ duration: 0.15 }}
      >
         <div className='w-[95vw] max-w-[500px] bg-custom-white-200 dark:bg-custom-navy-600 p-6 md:p-7 rounded-md drop-shadow-2xls shadow-2xl'>
            <h2 className='text-center text-2xl'>Reset Database</h2>
            <br />
            <span>
               This action will undo any updates/changes you have made to the dataset of movies!
            </span>
            <div className='mt-5 flex items-center justify-evenly'>
               <button
                  className='px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:shadow-xl duration-200'
                  onClick={() => handleClick(true)}
               >
                  Proceed
               </button>
               <button
                  className='px-4 py-2 bg-custom-blue-200 text-white rounded-md shadow-md hover:shadow-xl duration-200'
                  onClick={() => handleClick(false)}
               >
                  Cancel
               </button>
            </div>
         </div>
      </motion.div>,
      document.getElementById('modal') as HTMLDivElement
   )
}

export default ResetModal
