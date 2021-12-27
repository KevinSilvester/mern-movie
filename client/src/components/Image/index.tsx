import { useState, useEffect } from 'react'
import ContentLoader from 'react-content-loader'
import { Movie } from '@interface/Movie'
import useStore from '@store/useStore'
import * as api from '@api/api'

const Image: React.FC<{ movie: Movie; className?: string }> = ({ movie, className }) => {
   const { modalOpen, actions } = useStore(state => state)
   const [loaded, setLoaded] = useState<boolean>(false)
   const [image, setImage] = useState<string>(movie.posterUrl)

   const handleError = async (): Promise<void> => {
      const fallback = await api.getFallBack(movie.title)
      setImage(fallback)
   }

   return (
      <>
         <img
         key={image}
            src={image}
            alt={movie.title}
            loading='lazy'
            className={className}
            onError={() => handleError()}
            onLoad={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0 }}
            onClick={() => !modalOpen && actions.modalOpen(movie)}
         />
         {!loaded && (
            <ContentLoader
               backgroundColor={'var(--skeleton-bg)'}
               foregroundColor={'var(--skeleton-fg)'}
               speed={2}
               className='absolute h-full w-full rounded-md top-0 left-0 aspect-[9/16]'
            >
               <rect x='0' y='0' rx='0' ry='0' width='200' height='300' />
            </ContentLoader>
         )}
      </>
   )
}

export default Image
