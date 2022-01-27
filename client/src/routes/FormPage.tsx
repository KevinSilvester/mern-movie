import Form from '@comp/Form'
import Nav from '@comp/Nav/Nav'
import SvgLeft from '@comp/Svg/SvgLeft'
import { Link } from 'react-router-dom'

const FormPage = () => {
   return (
      <>
         <Nav />
         <h1>Add Movie</h1>
         <Form />
      </>
   )
}

export default FormPage
