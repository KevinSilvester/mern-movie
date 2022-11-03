import type { ApiResponse } from '@lib/types'
import TextSkeleton from '@comp/TextSkeleton'
import Pill from '@comp/Pill'

const PageContent: React.FC<{ movie: ApiResponse['movie']; isFetched: boolean }> = ({ movie, isFetched }) => {
   return (
      <section className='my-6 bg-white dark:bg-custom-navy-500 rounded-md shadow-md dark:shadow-none p-4 lg:!w-96'>
         <div aria-label='Plot Section' className=''>
            <span className='text-xl font-bold dark:text-custom-white-100'>Plot</span>
            <div className='w-full h-fit'>
               {isFetched ? (
                  movie?.plot
               ) : (
                  <div className='w-full h-16 flex flex-col justify-evenly gap-2'>
                     <TextSkeleton className='w-full h-full' />
                     <TextSkeleton className='w-full h-full' />
                     <TextSkeleton className='w-4/6 h-full' />
                  </div>
               )}
            </div>
         </div>
         <div aria-label='Year Section' className='mt-3'>
            <span className='text-xl font-bold dark:text-custom-white-100'>Year</span>
            {isFetched ? (
               <div className='flex justify-start gap-1 flex-wrap'>
                  <Pill>{movie?.year}</Pill>
               </div>
            ) : (
               <TextSkeleton className='w-1/5 h-5' />
            )}
         </div>
         <div aria-label='Genres Section' className='mt-3'>
            <span className='text-xl font-bold dark:text-custom-white-100'>Genres</span>
            {isFetched ? (
               <div className='flex justify-start gap-1 flex-wrap'>
                  {movie?.genres.map((genre, index) => (
                     <Pill key={index + genre}>{genre}</Pill>
                  ))}
               </div>
            ) : (
               <TextSkeleton className='w-4/5 h-5' />
            )}
         </div>
         <div aria-label='Actors Section' className='mt-3'>
            <span className='text-xl font-bold dark:text-custom-white-100'>Actors</span>
            {isFetched ? (
               <div className='flex justify-start gap-1 flex-wrap'>
                  {movie?.actors.map((actor, index) => (
                     <Pill key={index + actor}>{actor}</Pill>
                  ))}
               </div>
            ) : (
               <TextSkeleton className='w-4/5 h-5' />
            )}
         </div>
         <div aria-label='Director Section' className='mt-3'>
            <span className='text-xl font-bold dark:text-custom-white-100'>Director</span>
            {isFetched ? (
               <div className='flex justify-start gap-1 flex-wrap'>
                  {movie?.director.map((director, index) => (
                     <Pill key={index + director}>{director}</Pill>
                  ))}
               </div>
            ) : (
               <TextSkeleton className='w-2/5 h-5' />
            )}
         </div>
         <div aria-label='Runtime Section' className='mt-3'>
            <span className='text-xl font-bold dark:text-custom-white-100'>Runtime</span>
            {isFetched ? (
               <div className='flex justify-start gap-1 flex-wrap'>
                  <Pill>{movie?.runtime}</Pill>
               </div>
            ) : (
               <TextSkeleton className='w-1/5 h-5' />
            )}
         </div>
      </section>
   )
}

export default PageContent
