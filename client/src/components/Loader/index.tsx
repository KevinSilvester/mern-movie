import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const LoadBar = () => {
   return (
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
         <Loader type='Bars' color='#00BFFF' height={80} width={80} />
      </div>
   )
}

export default LoadBar
