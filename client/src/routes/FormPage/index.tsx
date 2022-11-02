import type { ApiResponse, MovieForm } from '@lib/types'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import NavSecondary from '@comp/NavSecondary'
import schema from '@lib/schema'
import Input from './Input'
import InputArray from './InputArray'
import InputCheckbox from './InputCheckbox'
import InputImage from './InputImage'
import SvgExclamationTriangle from '@comp/Svg/SvgExclamationTriangle'
import { notifyError, notifySuccess } from '@lib/toaster'
import { createMovie, getMovie, updateMovie } from '@lib/api'
import Loader from '@comp/Loader'

const FormPage: React.FC<{ edit: boolean }> = ({ edit }) => {
   const navigate = useNavigate()

   const { id } = useParams()

   const methods = useForm<MovieForm>({
      resolver: zodResolver(schema),
      defaultValues: {
         title: '',
         year: undefined,
         plot: '',
         genres: [],
         actors: [],
         director: [],
         runtime: undefined,
         poster: {
            image: undefined
         }
      }
   })

   const { isError, isFetched, data } = id
      ? useQuery<ApiResponse>(['movie', id], () => getMovie(id as string), {
           refetchOnMount: false,
           refetchOnWindowFocus: false,
           retry: 0
        })
      : {
           isError: false,
           isFetched: true,
           data: {}
        }

   const queryClient = useQueryClient()

   const { mutate: create } = useMutation<ApiResponse, Record<string, unknown>, MovieForm>(createMovie, {
      onSuccess: async data => {
         await queryClient.refetchQueries(['movies'], { exact: true })
         notifySuccess(data?.message as string)
         setTimeout(() => navigate(`/movie/${data.movie?._id}`), 1000)
      },
      onError: () => {
         notifyError('Add movie failed! (◎﹏◎)')
      }
   })

   const { mutate: update } = useMutation<ApiResponse, Record<string, unknown>, MovieForm>(
      updatedMovie => updateMovie(id as string, updatedMovie),
      {
         onSuccess: async data => {
            await queryClient.refetchQueries(['movies'], { exact: true })
            await queryClient.refetchQueries(['movie', id], { exact: true })
            notifySuccess(data?.message as string)
            setTimeout(() => navigate(`/movie/${data.movie?._id}`), 1000)
         },
         onError: () => {
            notifyError('Edit failed! (◎﹏◎)')
         }
      }
   )

   useEffect(() => {
      if (edit && data) {
         // @ts-ignore
         const movie: ApiResponse['movie'] = data.movie
         methods.reset({
            title: movie?.title as string,
            year: movie?.year as number,
            genres: [...(movie?.genres as string[])],
            plot: movie?.plot as string,
            actors: [...(movie?.actors as string[])],
            director: [...(movie?.director as string[])],
            runtime: movie?.runtime as number,
            poster: {
               image: movie?.poster.image as string
            }
         })
      }
   }, [edit, data])

   const onSubmit = (formData: MovieForm) => {
      if (Object.keys(methods.formState.errors).length) {
         notifyError('Please fill all fields of the form! (◎﹏◎)')
      } else {
         if (edit) update(formData)
         else create(formData)
      }
   }

   return (
      <>
         <NavSecondary />
         <main className='px-5 h-auto w-full md:w-2xl mt-24 mb-14 mx-auto lg:px-0 lg:w-full lg:max-w-5xl lg:mt-24 lg:mx-auto'>
            {!isError && isFetched ? (
               <FormProvider {...methods}>
                  <form
                     onSubmit={methods.handleSubmit(onSubmit)}
                     className='flex flex-col w-[85vw] mx-auto gap-5 max-w-2xl'
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

                     <InputArray inputName='director'>
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
                           type='submit'
                           className='w-full h-11 bg-red-500 text-white rounded-md shadow-md dark:shadow-none cursor-pointer'
                        >
                           Submit
                        </button>
                        <button
                           className='w-full h-11 bg-custom-blue-200 text-white rounded-md shadow-md dark:shadow-none'
                           onClick={() => navigate('/')}
                        >
                           Cancel
                        </button>
                     </div>
                  </form>
               </FormProvider>
            ) : (
               <Loader />
            )}
         </main>
      </>
   )
}

export default FormPage
