import type { MovieForm } from '@lib/types'
import { useFormContext } from "react-hook-form"
import genres from '@lib/genres'
import SvgExclamationTriangle from '@comp/Svg/SvgExclamationTriangle'

const InputCheckbox: React.FC = ({ children }) => {
   const { formState, register } = useFormContext<MovieForm>()

   return (
      <div className='flex flex-col'>
         {children}
         <div
            className={`grid grid-cols-3 bg-white py-3 px-3 rounded-md shadow-md gap-x-1 gap-y-4 dark:bg-custom-navy-500 dark:shadow-none ${
               formState.errors.genres ? '!ring-2 !ring-red-500' : 'shadow-md dark:shadow-none'
            }`}
         >
            {genres.map(genre => (
               <div key={genre.value} className='flex items-center gap-1'>
                  <input
                     type='checkbox'
                     value={genre.value}
                     className='rounded text-custom-blue-100 focus:ring-custom-blue-100 duration-75'
                     {...register('genres')}
                  />
                  <label htmlFor={`genre.${genre.value}`}>{genre.value}</label>
               </div>
            ))}
         </div>
         {formState.errors.genres && (
            <span className='text-sm text-red-500 px-2 py-1 mt-1 h-7 w-fit bg-red-50 rounded-md flex gap-x-2 items-center'>
               <SvgExclamationTriangle className='h-2/3' />
               {
                  // @ts-ignore
                  formState.errors.genres.message
               }
            </span>
         )}
      </div>
   )
}

export default InputCheckbox