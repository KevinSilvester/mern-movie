/** @jsxRuntime classic */
/** @jsx jsx */

import type { MovieTitle } from '@lib/types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import TextSkeleton from '@comp/TextSkeleton'
import Warning from '@comp/Warning'
import { css, jsx } from '@emotion/react'
import { FALLBACK_POSTER } from '@lib/api'
import { loader } from '@lib/styles'
import { nullThenUndefined } from '@lib/utils'

const Card: React.FC<{ movie: MovieTitle }> = ({ movie }) => {
   const [loaded, setLoaded] = useState<boolean>(false)
   const [error, setError] = useState<boolean>(false)

   return (
      <Link
         to={`movie/${movie._id}`}
         preventScrollReset={true}
         className='grid grid-rows-[min-content_auto] relative w-full'
      >
         <div className='transition-all rounded-md inline-block relative w-full z-10 overflow-hidden shadow-custom-navy-600/10 shadow-md drop-shadow-md dark:shadow-none dark:drop-shadow-none aspect-[10/16]'>
            {error && <Warning />}
            <img
               src={
                  movie.poster_uploaded
                     ? `https://moviedb-posters.kevins.site/${movie._id}`
                     : nullThenUndefined(movie.tmdb.poster_path)
               }
               alt={movie.title}
               loading='lazy'
               className='h-full object-cover absolute top-0 left-0 w-full z-0'
               onLoad={() => setLoaded(true)}
               onError={e => {
                  e.currentTarget.src = FALLBACK_POSTER
                  setError(true)
               }}
               css={css`
                  opacity: ${!loaded && 0};
               `}
            />
            {!loaded && <div className='h-full object-cover absolute top-0 left-0 w-full z-0' css={loader} />}
         </div>
         {loaded ? (
            <span
               className='text-left text-[0.95rem] lg:text-xl mt-2 relative w-full h-fit'
               style={{ overflowWrap: 'anywhere' }}
            >
               {movie.title}
            </span>
         ) : (
            <TextSkeleton className='w-[80%] h-4 md:h-6 mt-2' />
         )}
      </Link>
   )
}

export default Card
