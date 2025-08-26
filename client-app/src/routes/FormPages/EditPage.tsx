import type { ApiResponse, MovieForm, Movie } from '@lib/types'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import NavSecondary from '@comp/NavSecondary'
import Loader from '@comp/Loader'
import schema from '@lib/schema'
import { notifyError, notifyLoading, updateLoading } from '@lib/toaster'
import { getMovie, updateMovie, API_URL } from '@lib/api'
import FormSection from './FormSection'

const EditPage: React.FC = () => {
   const navigate = useNavigate()
   const { id } = useParams()
   const {
      isError,
      isFetched,
      data: res
   } = useQuery<ApiResponse<Movie>>(['movie', id], () => getMovie(id as string), {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0
   })
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
      mutationFn: (movie: MovieForm) => updateMovie(id as string, movie),
      onSuccess: async res => {
         if (!res.success) {
            updateLoading('movie', 'Update movie failed! (◎﹏◎)', false, 2000)
            console.error(res?.error)
            return
         }
         await queryClient.invalidateQueries(['movies'])
         await queryClient.invalidateQueries(['movie', id])
         updateLoading('movie', res?.data.message, true)
         setTimeout(() => navigate(`/movie/${res.data.payload}`), 1000)
      },
      onError: () => {
         updateLoading('movie', 'Update movie failed! (◎﹏◎)', false, 2000)
      }
   })

   const onSubmit = (formData: MovieForm) => {
      if (Object.keys(methods.formState.errors).length) {
         notifyError('Please fill all fields of the form! (◎﹏◎)')
      } else {
         notifyLoading('Updating movie...', { toastId: 'movie', isLoading: true })
         mutate(formData)
      }
   }

   useEffect(() => {
      if (res) {
         if (!res.success) {
            console.error(res?.error)
            notifyError(res?.error?.message || 'An error occurred! (◎﹏◎)')
            return
         }

         const movie = res.data?.payload as Movie

         const tmdbPoster = movie.tmdb.poster_path ? `${API_URL}/movie/${movie._id}/tmdb-poster` : undefined

         methods.reset({
            title: movie?.title as string,
            year: movie?.year as number,
            genres: [...(movie?.genres as string[])],
            plot: movie?.plot as string,
            actors: [...(movie?.actors as string[])],
            directors: [...(movie?.directors as string[])],
            runtime: movie?.runtime as number,
            poster_uploaded: movie.poster_uploaded,
            poster_string: movie.poster_uploaded ? `https://mern-movie-posters.kevins.site/${movie._id}` : tmdbPoster
         })
      }
   }, [res])

   return (
      <>
         <NavSecondary />
         <main className='px-5 h-auto w-full md:w-2xl mt-24 mb-14 mx-auto lg:px-0 lg:w-full lg:max-w-5xl lg:mt-24 lg:mx-auto'>
            <div>
               {!isError && isFetched ? (
                  <FormSection edit={true} methods={methods} onSubmit={onSubmit} />
               ) : isError ? (
                  <div className='flex items-center justify-center h-96'>
                     <h1 className='text-2xl font-bold text-gray-700'>
                        An Error occurred while loading the Movie! Please try again later. (⊙_☉)
                     </h1>
                  </div>
               ) : (
                  <Loader />
               )}
            </div>
         </main>
      </>
   )
}

export default EditPage
