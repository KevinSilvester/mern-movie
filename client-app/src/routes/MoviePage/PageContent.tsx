import type { Movie } from '@lib/types'
import Pill from '@comp/Pill'
import TextSkeleton from '@comp/TextSkeleton'

const PageContent: React.FC<{ movie?: Movie; isFetched: boolean }> = ({ movie, isFetched }) => {
   const runtime = movie?.runtime ? `${Math.floor(movie?.runtime / 60)}h ${movie?.runtime % 60}m` : ''

   return (
      <section className='my-6 bg-white dark:bg-custom-navy-500 rounded-md shadow-md dark:shadow-none p-4 lg:!w-96'>
         <section aria-label='Plot Section' className=''>
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
         </section>
         <section aria-label='Year Section' className='mt-3'>
            <span className='text-xl font-bold dark:text-custom-white-100'>Year</span>
            {isFetched ? (
               <div className='flex justify-start gap-1 flex-wrap'>
                  <Pill>{movie?.year}</Pill>
               </div>
            ) : (
               <TextSkeleton className='w-1/5 h-5' />
            )}
         </section>
         <section aria-label='Genres Section' className='mt-3'>
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
         </section>
         <section aria-label='Actors Section' className='mt-3'>
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
         </section>
         <section aria-label='Director Section' className='mt-3'>
            <span className='text-xl font-bold dark:text-custom-white-100'>Director</span>
            {isFetched ? (
               <div className='flex justify-start gap-1 flex-wrap'>
                  {movie?.directors.map((director, index) => (
                     <Pill key={index + director}>{director}</Pill>
                  ))}
               </div>
            ) : (
               <TextSkeleton className='w-2/5 h-5' />
            )}
         </section>
         <section aria-label='Runtime Section' className='mt-3'>
            <span className='text-xl font-bold dark:text-custom-white-100'>Runtime</span>
            {isFetched ? (
               <div className='flex justify-start gap-1 flex-wrap'>
                  <Pill>{runtime}</Pill>
               </div>
            ) : (
               <TextSkeleton className='w-1/5 h-5' />
            )}
         </section>
         <section aria-label='Runtime Section' className='mt-3'>
            <span className='text-xl font-bold dark:text-custom-white-100'>Budget</span>
            {isFetched ? (
               <div className='flex justify-start gap-1 flex-wrap'>
                  <Pill>
                     {movie?.tmdb.found
                        ? movie?.tmdb.budget?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                        : 'N/A'}
                  </Pill>
               </div>
            ) : (
               <TextSkeleton className='w-1/5 h-5' />
            )}
         </section>
         <section aria-label='Runtime Section' className='mt-3'>
            <span className='text-xl font-bold dark:text-custom-white-100'>Revenue</span>
            {isFetched ? (
               <div className='flex justify-start gap-1 flex-wrap'>
                  <Pill>
                     {movie?.tmdb.found
                        ? movie?.tmdb.revenue?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                        : 'N/A'}
                  </Pill>
               </div>
            ) : (
               <TextSkeleton className='w-1/5 h-5' />
            )}
         </section>
      </section>
   )
}

export default PageContent
