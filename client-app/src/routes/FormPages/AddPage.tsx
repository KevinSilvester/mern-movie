import type { MovieForm } from '@lib/types'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from 'react-query'
import NavSecondary from '@comp/NavSecondary'
import schema from '@lib/schema'
import { notifyError, notifyLoading, updateLoading } from '@lib/toaster'
import { createMovie } from '@lib/api'
import FormSection from './FormSection'

const AddPage: React.FC = () => {
   const navigate = useNavigate()
   const queryClient = useQueryClient()
   const methods = useForm<MovieForm>({
      resolver: zodResolver(schema),
      defaultValues: {
         title: '',
         year: undefined,
         genres: [],
         directors: [],
         actors: [],
         plot: '',
         runtime: undefined,
         poster_string: undefined,
         poster_uploaded: false
      }
   })
   const { mutate } = useMutation({
      mutationFn: (movie: MovieForm) => createMovie(movie),
      onSuccess: async res => {
         if (!res.success) {
            updateLoading('movie', 'Create movie failed! (◎﹏◎)', false, 2000)
            console.error(res?.error)
            return
         }
         await queryClient.invalidateQueries(['movies'])
         updateLoading('movie', res?.data.message, true)
         setTimeout(() => navigate(`/movie/${res.data.payload}`), 1000)
      },
      onError: () => {
         updateLoading('movie', 'Create movie failed! (◎﹏◎)', false, 2000)
      }
   })
   const onSubmit = (formData: MovieForm) => {
      if (Object.keys(methods.formState.errors).length) {
         notifyError('Please fill all fields of the form! (◎﹏◎)')
      } else {
         notifyLoading('Creating movie...', { toastId: 'movie', isLoading: true })
         mutate(formData)
      }
   }
   return (
      <>
         <NavSecondary />
         <main className='px-5 h-auto w-full md:w-2xl mt-24 mb-14 mx-auto lg:px-0 lg:w-full lg:max-w-5xl lg:mt-24 lg:mx-auto'>
            <div>
               <FormSection edit={false} methods={methods} onSubmit={onSubmit} />
            </div>
         </main>
      </>
   )
}

export default AddPage
