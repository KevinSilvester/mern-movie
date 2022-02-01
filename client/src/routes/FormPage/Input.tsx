import type { MovieForm } from '@lib/types'
import { useFormContext } from "react-hook-form"
import SvgExclamationTriangle from '@comp/Svg/SvgExclamationTriangle'

type Props = {
   type: 'number' | 'text'
   inputName: 'title' | 'year' | 'runtime'
}

const Input: React.FC<Props> = ({ children, type, inputName }) => {
   const { register, formState } = useFormContext<MovieForm>()

   const TextInput = (
      <input
         type='text'
         {...register(inputName, { valueAsNumber: false })}
         className={`h-11 rounded-md shadow-md  border-none focus:ring-custom-blue-100/70 dark:focus:ring-custom-blue-200/70 focus:border-none focus:ring-2 dark:bg-custom-navy-500  ${
            formState.errors[inputName] ? '!ring-2 !ring-red-500' : 'shadow-md dark:shadow-none'
         }`}
      />
   )

   const NumberInput = (
      <input
         type='number'
         {...register(inputName, { valueAsNumber: true })}
         className={`h-11 rounded-md shadow-md  border-none focus:ring-custom-blue-100/70 dark:focus:ring-custom-blue-200/70 focus:border-none focus:ring-2 dark:bg-custom-navy-500  ${
            formState.errors[inputName] ? '!ring-2 !ring-red-500' : 'shadow-md dark:shadow-none'
         }`}
      />
   )

   return (
      <>
         <div className='flex flex-col'>
            {children}
            {type === 'number' ? NumberInput : TextInput}
            {formState.errors[inputName] && (
               <span className='text-sm text-red-500 px-2 py-1 mt-1 h-7 w-fit bg-red-50 rounded-md flex gap-x-2 items-center'>
                  <SvgExclamationTriangle className='h-2/3' />
                  <span>{formState.errors[inputName]?.message}</span>
               </span>
            )}
         </div>
      </>
   )
}

export default Input