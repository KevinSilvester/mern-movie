import type { MovieForm } from '@lib/types'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import SvgAdd from '@comp/Svg/SvgAdd'
import SvgExclamationTriangle from '@comp/Svg/SvgExclamationTriangle'

type Props = {
   inputName: 'actors' | 'director'
}

const InputArray: React.FC<Props> = ({ children, inputName }) => {
   const { setValue, getValues, watch, formState, setError, clearErrors } =
      useFormContext<MovieForm>()
   const [inputValue, setInputValue] = useState<string>('')

   const storedValues = watch(inputName)

   useEffect(() => {
      const subscription = watch(data => {
         formState.isSubmitted && (data[inputName]?.length as number) === 0
            ? setError(inputName, {
                 message: `Must have at least 1 ${inputName === 'actors' ? 'Actor' : 'Director'}`
              })
            : clearErrors(inputName)
      })
      return () => subscription.unsubscribe()
   }, [watch, formState])

   return (
      <>
         <div className='flex flex-col gap-y-1'>
            {children}
            <div className='flex gap-x-2 gap-y-1 flex-wrap'>
               {getValues(inputName).map((name: string, index: number) => (
                  <div
                     key={index}
                     className='bg-custom-slate-50 dark:bg-custom-navy-100 px-1 pl-2 rounded-lg flex gap-1 items-center'
                  >
                     <span>{name}</span>
                     <div
                        className='h-4 w-4 rounded-full text-white grid place-items-center'
                        onClick={e => {
                           e.preventDefault()
                           setValue(inputName, [
                              ...getValues(inputName).filter((a: string) => a !== name)
                           ])
                        }}
                     >
                        <SvgAdd className='h-full rotate-45' />
                     </div>
                  </div>
               ))}
            </div>
            {getValues(inputName).length < 6 && (
               <>
                  <div className='grid grid-cols-[auto_3rem] md:grid-cols-[auto_4rem]'>
                     <input
                        type='text'
                        value={inputValue}
                        className={`h-11 rounded-l-md shadow-md  border-none focus:ring-custom-blue-100/70 dark:focus:ring-custom-blue-200/70 focus:border-none focus:ring-2 dark:bg-custom-navy-500 ${
                           formState.errors[inputName]
                              ? '!ring-2 !ring-red-500'
                              : 'shadow-md dark:shadow-none'
                        }`}
                        onChange={e => setInputValue(e.target.value)}
                     />
                     <button
                        className='w-full h-11 grid place-items-center rounded-r-md shadow-md text-white bg-custom-navy-500 disabled:bg-custom-navy-500/50 dark:bg-custom-blue-200 dark:disabled:bg-custom-blue-200/40'
                        disabled={inputValue.length <= 2}
                        aria-disabled={inputValue.length <= 2}
                        onClick={e => {
                           e.preventDefault()
                           if (!getValues(inputName).includes(inputValue) && inputValue.length > 2) {
                              setValue(inputName, [...storedValues, inputValue])
                              setInputValue('')
                           }
                        }}
                     >
                        <SvgAdd className='h-1/2' />
                        {/* {`Add ${inputName === 'actors' ? 'Actor' : 'Director'}`} */}
                     </button>
                  </div>
                  {formState.errors[inputName] && (
                     <span className='text-sm text-red-500 px-2 py-1 mt-0 h-7 w-fit bg-red-50 rounded-md flex gap-x-2 items-center'>
                        <SvgExclamationTriangle className='h-2/3' />
                        {
                           // @ts-ignore
                           formState.errors[inputName].message
                        }
                     </span>
                  )}
               </>
            )}
         </div>
      </>
   )
}

export default InputArray
