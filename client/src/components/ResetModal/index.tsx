/** @jsxRuntime classic */
/** @jsx jsx */
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { css, jsx, keyframes } from '@emotion/react'
import { motion } from 'framer-motion'

const ResetModal: React.FC<{ handleClose: (proceed: boolean) => Promise<void> }> = ({
   handleClose
}) => {
   const [open, setOpen] = useState<boolean>(true)

   const handleClick = (proceed: boolean) => {
      setOpen(false)
      handleClose(proceed)
   }

   const openAni = keyframes`
      from {
         opacity: 0;
      }
      to {
         opacity: 1;
      }
   `

   const closeAni = keyframes`
      from {
         opacity: 1;
      }
      to {
         opacity: 0;
      }
   `

   const modal = css`
      animation: ${open ? openAni : closeAni} 0.15s linear forwards;
   `

   return createPortal(
      <motion.div
         className='fixed top-0 left-0 h-screen w-screen backdrop-blur-sm bg-black/40 dark:bg-black/50 z-50 grid place-items-center'
         key='reset-modal'
         transition={{ duration: 0.2 }}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
      >
         <div className='w-[95vw] max-w-[500px] bg-custom-white-200 dark:bg-custom-navy-600 p-6 md:p-7 rounded-md drop-shadow-2xls shadow-2xl'>
            <h2 className='text-center text-2xl'>Reset Database</h2>
            <br />
            <span>
               This action will undo any updates/changes you have made to the dataset of movies!
            </span>
            <div className='mt-5 flex items-center justify-evenly'>
               <button
                  className='px-4 py-2 bg-custom-blue-200 text-white rounded-md shadow-md hover:shadow-xl duration-200'
                  onClick={() => handleClick(false)}
               >
                  Cancel
               </button>
               <button
                  className='px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:shadow-xl duration-200'
                  onClick={() => handleClick(true)}
               >
                  Proceed
               </button>
            </div>
         </div>
      </motion.div>,
      // @ts-ignore
      document.getElementById('modal')
   )
}

export default ResetModal
