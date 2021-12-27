import { useState, useEffect } from 'react'
import ContentLoader from 'react-content-loader'
import { css } from 'glamor'
import { Movie } from '@interface/Movie'
import { Link } from 'react-router-dom'
import Image from '@comp/Image'
import * as api from '@api/api'

const Card: React.FC<{ movie: Movie }> = ({ movie }) => {
   const [loaded, setLoaded] = useState<boolean>(false)
   const [image, setImage] = useState<string>(movie.posterUrl)

   useEffect(() => {
      const updateLoaded = () => setTimeout(() => setLoaded(true), 10000)
      updateLoaded()
   },[])

   const handleError = async (): Promise<void> => {
      const fallback = await api.getFallBack(movie.title)
      setImage(fallback)
   }

   const imgWrapper = css({
      background: 'var(--comp-bg)',
      opacity: loaded ? 1 : 0,
      '::before': {
         content: 'hello',

      }
   })

   return (
      <Link to={`movie/${movie._id}`} className='grid grid-rows-[min-content_auto] relative w-full'>
            <div className='transition-all rounded-md inline-block relative w-full z-10 overflow-hidden' {...imgWrapper}>
               <img
                  src={image}
                  alt={movie.title}
                  loading='lazy'
                  className='shadow-center border-2 border-white none h-full object-cover absolute top-0 left-0 w-full'
                  style={{ display: 'none' }}
                  onError={() => handleError()}
               />
            </div>
            <span className='text-left text-[0.7rem] lg:text-lg'>{movie.title}</span>
      </Link>
   )
}

export default Card
