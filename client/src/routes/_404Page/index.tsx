import { Link } from 'react-router-dom'
import '@scss/404.scss'

const _404Page: React.FC = () => {
   return (
      <>
         <div id='_404'></div>
         <div className='text-center absolute top-[60vh] left-1/2 -translate-x-1/2 text-2xl'>
            <div>Page Not Found</div>
            <Link to='/' className='underline hover:text-custom-grey-200'>
               Go to Home Page
            </Link>
         </div>
      </>
   )
}

export default _404Page
