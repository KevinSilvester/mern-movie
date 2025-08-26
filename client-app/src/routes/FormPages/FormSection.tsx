import type { MovieForm } from '@lib/types'
import type { UseFormReturn } from 'react-hook-form'

import { FormProvider } from 'react-hook-form'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import SvgExclamationTriangle from '@comp/Svg/SvgExclamationTriangle'
import Input from './Input'
import InputArray from './InputArray'
import InputCheckbox from './InputCheckbox'
import InputImage from './InputImage'

const FormSection: React.FC<{
   edit: boolean
   methods: UseFormReturn<MovieForm, any, MovieForm>
   onSubmit: (movie: MovieForm) => void
}> = ({ edit, methods, onSubmit }) => {
   const navigate = useNavigate()
   const navType = useNavigationType()
   const location = useLocation()

   return (
      <FormProvider {...methods}>
         <form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col w-[85vw] mx-auto gap-5 max-w-2xl'>
            <Input inputName='title' type='text'>
               <label htmlFor='title' className='font-bold text-xl'>
                  Title
               </label>
            </Input>

            <Input inputName='year' type='number'>
               <label htmlFor='year' className='font-bold text-xl'>
                  Year
               </label>
            </Input>

            <InputCheckbox>
               <label htmlFor='genres' className='font-bold text-xl'>
                  Genres
               </label>
            </InputCheckbox>

            <div className='flex flex-col'>
               <label htmlFor='plot' className='font-bold text-xl'>
                  Plot
               </label>
               <textarea
                  className={`resize-none h-28 rounded-md shadow-md  border-none focus:ring-custom-blue-100/70 dark:focus:ring-custom-blue-200/70 focus:border-none focus:ring-2 dark:bg-custom-navy-500  ${
                     methods.formState.errors.plot ? '!ring-2 !ring-red-500' : 'shadow-md dark:shadow-none'
                  }`}
                  {...methods.register('plot')}
               ></textarea>
               {methods.formState.errors.plot && (
                  <span className='text-sm text-red-500 px-2 py-1 mt-1 h-7 w-fit bg-red-50 rounded-md flex gap-x-2 items-center'>
                     <SvgExclamationTriangle className='h-2/3' />
                     <span>{methods.formState.errors.plot.message}</span>
                  </span>
               )}
            </div>

            <InputArray inputName='actors'>
               <label htmlFor='actors' className='font-bold text-xl'>
                  Actors
               </label>
            </InputArray>

            <InputArray inputName='directors'>
               <label htmlFor='actors' className='font-bold text-xl'>
                  Directors
               </label>
            </InputArray>

            <Input inputName='runtime' type='number'>
               <label htmlFor='runtime' className='font-bold text-xl'>
                  Runtime
               </label>
            </Input>

            <InputImage edit={edit}>
               <label htmlFor='image' className='font-bold text-xl'>
                  Poster
               </label>
            </InputImage>

            <div className='flex justify-evenly items-center gap-2'>
               <button
                  type='button'
                  className='w-full h-11 bg-red-500 text-white rounded-md shadow-md dark:shadow-none cursor-pointer'
                  onClick={e => {
                     e.preventDefault()
                     navType !== 'PUSH' ? navigate(`/${location.search}`) : navigate(-1)
                  }}
               >
                  Cancel
               </button>
               <button
                  type='submit'
                  className='w-full h-11 bg-custom-blue-200 text-white rounded-md shadow-md dark:shadow-none'
               >
                  Submit
               </button>
            </div>
         </form>
      </FormProvider>
   )
}

export default FormSection
