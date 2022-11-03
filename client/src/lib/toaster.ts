import { toast, Slide, ToastOptions } from 'react-toastify'
import 'react-toastify/scss/main.scss'

const defaultOptions: ToastOptions = {
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
