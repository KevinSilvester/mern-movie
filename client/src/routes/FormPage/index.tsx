import type { Control } from 'react-hook-form'
import type { MovieForm } from '@lib/types'
import { Link } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import NavSecondary from '@comp/NavSecondary'
import schema from '@lib/schema'
import Input from './Input'
import ArrayInput from './ArrayInput'
import CheckboxInput from './CheckboxInput'

import ImageInput from './ImageInput'
import SvgExclamationTriangle from '@comp/Svg/SvgExclamationTriangle'


export interface FormValues {
   title: string
   year: number
   genres: string[]
   director: string[]
   actors: string[]
   plot: string
   runtime: number
   image: string
}

const FormPage = () => {
   const methods = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
         title: '',
         year: undefined,
         genres: [],
         actors: [],
         director: [],
         runtime: undefined,
         image: ''
      }
   })

   const handleSubmit = (data: FormValues) => {
      console.log(data)
   }


   return (
      <>
         <NavSecondary />
         <main className='px-5 h-auto w-full md:w-2xl mt-24 mx-auto lg:px-0 lg:w-full lg:max-w-5xl lg:mt-24 lg:mx-auto'>
            <FormProvider {...methods}>
               <form
                  onSubmit={methods.handleSubmit(data => handleSubmit(data))}
                  className='flex flex-col w-[85vw] mx-auto gap-4'
               >
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

                  <CheckboxInput>
                     <label htmlFor='genres' className='font-bold text-xl'>
                        Genres
                     </label>
                  </CheckboxInput>

                  <div className='flex flex-col'>
                     <label htmlFor='plot' className='font-bold text-xl'>
                        Genres
                     </label>
                     <textarea
                        className={`h-28 rounded-md shadow-md  border-none focus:ring-custom-blue-100/70 dark:focus:ring-custom-blue-200/70 focus:border-none focus:ring-2 dark:bg-custom-navy-500  ${
                           methods.formState.errors.plot
                              ? '!ring-2 !ring-red-500'
                              : 'shadow-md dark:shadow-none'
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

                  <ArrayInput inputName='actors'>
                     <label htmlFor='actors' className='font-bold text-xl'>
                        Actors
                     </label>
                  </ArrayInput>

                  <ArrayInput inputName='director'>
                     <label htmlFor='actors' className='font-bold text-xl'>
                        Directors
                     </label>
                  </ArrayInput>

                  <Input inputName='runtime' type='number'>
                     <label htmlFor='runtime' className='font-bold text-xl'>
                        Runtime
                     </label>
                  </Input>

                  <ImageInput>
                     <label htmlFor='image' className='font-bold text-xl'>
                        Poster
                     </label>
                  </ImageInput>

                  <input type='submit' value='submit' className='w-full' />
               </form>
            </FormProvider>
         </main>
      </>
   )
}

export default FormPage
