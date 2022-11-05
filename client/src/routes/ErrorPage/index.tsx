import '@scss/error.scss'

const ErrorPage: React.FC = () => {
   return (
      <>
         <div id='error'></div>
         <div className='text-center absolute top-[60vh] left-1/2 -translate-x-1/2 text-2xl'>
            <div>An Error Occured</div>

            <button onClick={() => window.location.reload()} className='underline hover:text-custom-grey-200'>
               Please reload the Page
            </button>
         </div>
      </>
   )
}

export default ErrorPage
