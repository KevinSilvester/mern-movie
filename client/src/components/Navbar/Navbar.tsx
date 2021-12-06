import { HomeIcon, FilmIcon } from '@heroicons/react/solid'

const Navbar = () => {
   return (
      <>
         <div className='bg-dark-grey-1 fixed bottom-0 h-[4.5rem] w-full flex'>
            <button className='h-full w-1/2 grid place-items-center text-blue-500'>
               <HomeIcon className='h-2/3' />
            </button>

            <button className='h-full w-1/2 grid place-items-center'>
               <FilmIcon className='h-2/3' />
            </button>
         </div>
      </>
   )
}

export default Navbar
