import { useState } from 'react'
import { motion } from 'framer-motion'
import { Movie } from '@interface/Movie'
import { getFallBack } from '@api/api'

const Image: React.FC<{ movie: Movie; }> = ({ movie }) => {
   const [error, setError] = useState<boolean>(false)
   const [image, setImage] = useState<string>(movie.posterUrl)

   const handleError = async (): Promise<void> => {
      const fallback = await getFallBack(movie.title)
      await setImage(fallback)
   }

   return (
      <motion.img
         src={image}
         alt={movie.title}
         loading='lazy'
         className='rounded-md shadow-center border-2 border-white'
         onError={() => handleError()}
      />
   )
}

export default Image
