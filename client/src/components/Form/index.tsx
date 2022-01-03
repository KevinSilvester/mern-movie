import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Movie } from '@lib/interface'

const Form: React.FC<{ movie?: Movie }> = ({ movie }) => {
   const [title, setTitle] = useState<string>(movie?.title || '')
   const [year, setYear] = useState<string>(movie?.year || '')
   const [runtime, setRuntime] = useState<string>(movie?.runtime || '')
   const [genres, setGenres] = useState<string[]>(movie?.genres || [])
   const [director, setDirector] = useState<string>(movie?.director || '')
   const [actors, setActors] = useState<string[]>(movie?.actors || [])
   const [plot, setPlot] = useState<string>(movie?.plot || '')
   const [posterUrl, setPosterUrl] = useState<string>(movie?.poster.url || '')
   
   return (
      <form>
         <input type='text' placeholder='Title' />
         <input type='text' placeholder='Year' />
         <input type='text' placeholder='Runtime' />
         <input type='text' placeholder='Genres' />
         <input type='text' placeholder='Director' />
         <input type='text' placeholder='Actors' />
         <input type='text' placeholder='Plot' />
         <input type="text" placeholder='PosterURL' />
      </form>
   )
}

export default Form
