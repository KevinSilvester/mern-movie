import SvgAdd from '@comp/Svg/SvgAdd'
import type { ToastOptions } from 'react-toastify'
import { Slide, toast } from 'react-toastify'
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

export const notifyError = (message: string, toastOptions?: ToastOptions) =>
   toast.error(message, {
      ...defaultOptions,
      ...(toastOptions || {}),
      className: '!rounded-md shadow-md !mb-1 lg:!mb-2 !h-14 !min-h-0 !bg-red-50 !text-red-400'
   })

export const notifySuccess = (message: string, toastOptions?: ToastOptions) =>
   toast.success(message, {
      ...defaultOptions,
      ...(toastOptions || {}),
      className: '!rounded-md shadow-md !mb-1 lg:!mb-2 !h-14 !min-h-0 !bg-green-50 !text-green-400'
   })

export const notifyInfo = (message: string, toastOptions?: ToastOptions) =>
   toast.success(message, {
      ...defaultOptions,
      ...(toastOptions || {}),
      className: '!rounded-md shadow-md !mb-1 lg:!mb-2 !h-14 !min-h-0 !bg-blue-50 !text-blue-400'
   })

export const notifyLoading = (message: string, toastOptions?: ToastOptions) =>
   toast.loading(message, {
      ...defaultOptions,
      ...(toastOptions || {}),
      className: '!rounded-md shadow-md !mb-1 lg:!mb-2 !h-14 !min-h-0 !bg-yellow-50 !text-yellow-400'
   })

export const updateLoading = (id: React.ReactText, message: string, success: boolean, autoClose?: number) =>
   toast.update(id, {
      render: message,
      type: success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
      isLoading: false,
      autoClose: autoClose || 1500,
      className: `!rounded-md shadow-md !mb-1 lg:!mb-2 !h-14 !min-h-0 !bg-${success ? 'green' : 'red'}-50 !text-${success ? 'green' : 'red'}-400`
   })
