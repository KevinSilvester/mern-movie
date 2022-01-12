import Form from '@comp/Form'
import SvgLeft from '@comp/Svg/SvgLeft'
import { Link } from 'react-router-dom'

const FormPage = () => {
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

export default FormPage
