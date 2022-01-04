import Form from '@comp/Form'
import SvgLeft from '@comp/Svg/SvgLeft'
import { Link } from 'react-location'

const AddMovie = () => {
   return (
      <>
         <Link to='/'>
            <SvgLeft className='h-4' />
         </Link>
         <h1>Add Movie</h1>
         <Form />
      </>
   )
}

export default AddMovie
