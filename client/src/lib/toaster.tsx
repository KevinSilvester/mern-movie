import type { ToastOptions } from 'react-toastify'
import SvgAdd from '@comp/Svg/SvgAdd'
import { toast, Slide } from 'react-toastify'
import 'react-toastify/scss/main.scss'

export const defaultOptions: ToastOptions = {
   position: 'bottom-center',
   autoClose: 3500,
   hideProgressBar: true,
   closeOnClick: true,
   pauseOnHover: false,
   draggable: true,
   progress: undefined,
   theme: 'colored',
   transition: Slide
}

export const notifyError = (message: string, toastOptions = { ...defaultOptions }) =>
   toast.error(message, {
      ...defaultOptions,
      ...toastOptions,
      className: '!rounded-md shadow-md !mb-1 lg:!mb-2 !h-14 !min-h-0 !bg-red-50 !text-red-400'
   })

export const notifySuccess = (message: string, toastOptions = { ...defaultOptions }) =>
   toast.success(message, {
      ...defaultOptions,
      ...toastOptions,
      className: '!rounded-md shadow-md !mb-1 lg:!mb-2 !h-14 !min-h-0 !bg-green-50 !text-green-400'
   })

export const notifyInfo = (message: string, toastOptions = { ...defaultOptions }) =>
   toast.success(message, {
      ...defaultOptions,
      ...toastOptions,
      className: '!rounded-md shadow-md !mb-1 lg:!mb-2 !h-14 !min-h-0 !bg-blue-50 !text-blue-400'
   })

export const notifyPWA = (updateNow: (val: boolean) => void) => {
   const message = (
      <div className='flex flex-col gap-y-1'>
         <span className='text-lg text-center font-bold'>New content available!</span>
         <div className='flex justify-around items-center'>
            <button
               className='bg-blue-100 text-blue-400 font-semibold py-1 px-2 rounded-md duration-150 hover:bg-blue-200 hover:text-blue-500'
               onClick={() => updateNow(true)}
            >
               Update Now
            </button>
            <button
               className='bg-red-100 text-red-400 font-semibold py-1 px-2 rounded-md duration-150 hover:bg-red-200 hover:text-red-500'
               onClick={() => updateNow(false)}
            >
               Update Later
            </button>
         </div>
      </div>
   )

   return toast.info(message, {
      ...defaultOptions,
      autoClose: false,
      closeOnClick: false,
      className: '!rounded-md shadow-md !mb-1 lg:!mb-2 !h-18 !min-h-0 !bg-blue-50 !text-blue-400 !cursor-default',
      closeButton: ({ closeToast }) => (
         <button
            className='grid place-items-center bg-blue-100 text-blue-400 h-[20px] w-[20px] rounded-full duration-150 hover:bg-blue-200 hover:text-blue-500'
            onClick={e => {
               updateNow(false)
               closeToast(e)
            }}
         >
            <SvgAdd className='rotate-45 text-inherit h-3/4' />
         </button>
      )
   })
}
