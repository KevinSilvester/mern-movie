const Form = () => {
   return (
      <>
         <form className='h-[30rem] max-h-[30rem] w-1/3 rounded-md grid place-items-center shadow-lg bg-blue-300'>
            <input
               className='h-7 w-40 rounded-sm shadow-md outline-none p-1'
               type='text'
               placeholder='Title'
            />
         </form>
      </>
   )
}

export default Form
