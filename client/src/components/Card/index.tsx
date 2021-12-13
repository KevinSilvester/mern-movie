import { useState } from 'react'
import { Movie } from '@interface/Movie'
import { Link } from 'react-router-dom'
import Image from '@comp/Image'

const Card: React.FC<{ movie: Movie }> = ({ movie }) => {
   return (
      <Link to={`movie/${movie._id}`} className='grid grid-rows-[var(--col-1)] relative'>
         <Image movie={movie} className='rounded-md shadow-center border-2 border-white' />
         <span className='text-left text-[0.7rem] lg:text-lg'>{movie.title}</span>
      </Link>
   )
}

export default Card
