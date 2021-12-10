import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '@store/useStore'
import Image from '@comp/Image'

const Home: React.FC = () => {
   const { movies, loaded, error } = useStore(state => state)
   const [selectedId, setSelectedId] = useState<string | null>(null)

   return (
      <>
         <div>Home</div>
         <div className='grid grid-cols-[var(--col-3)] row-span-1 w-full gap-x-2 gap-y-5 justify-center mx-auto md:px-4 md:grid-cols-[var(--col-4)] md:gap-x-4 lg:grid-cols-[var(--col-5)] lg:gap-x-7 max-w-[1152px]'>
            {error || loaded &&
               movies.map(movie => {
                  return (
                     <motion.div className="grid grid-rows-[var(--col-1)]" layoutId={`${movie._id}`} onClick={() => setSelectedId(`${movie._id}`)}>
                        <Image key={movie._id} movie={movie} />
                        <motion.span className="text-left text-[0.7rem]">{movie.title}</motion.span>
                     </motion.div>
                  )
               })}

               
         </div>
      </>
   )
}

export default Home
