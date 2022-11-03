import { Link } from 'react-router-dom'

const _404Page: React.FC = () => {
   return (
      <>
         <div id='_404'></div>
         <Link
            to='/'
            className='absolute top-[60%] left-1/2 -translate-x-1/2 text-2xl underline hover:text-custom-grey-200'
         >
            Go to Home Page{' '}
         </Link>
      </>
   )
}

export default _404Page
