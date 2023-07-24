import LoadSpinner from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const Loader: React.FC = () => {
   return (
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30'>
         <LoadSpinner type='Bars' color='#00BFFF' height={80} width={80} />
      </div>
   )
}

export default Loader
