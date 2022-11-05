import type { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMediaMatch, useOutsideClick } from 'rooks'
import { usePopper } from 'react-popper'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SvgLeft from '@comp/Svg/SvgLeft'
import Pill from '@comp/Pill'
import SvgAdd from '@comp/Svg/SvgAdd'
import SvgCheck from '@comp/Svg/SvgCheck'
import { lockScreen, unlockScreen } from '@lib/scroll-lock'

export type SelectOption = {
   svg?: ReactJSXElement
   label: string
   value: string | number
}

type MultipleSelectProps = {
   multiple: true
   value: SelectOption[]
   onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
   multiple?: false
   value?: SelectOption
   onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
   options: SelectOption[]
   placeholder: string
} & (SingleSelectProps | MultipleSelectProps)

function Select({ options, placeholder, multiple, value, onChange }: SelectProps) {
   const [hasValues, setHasValues] = useState<boolean>(false)
   const [refElement, setRefElement] = useState<HTMLDivElement | null>(null)
   const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
   const [showOptions, setShowOptions] = useState<boolean>(false)
   const largeScreen = useMediaMatch('(min-width: 1024px)')

   const [optionHasFocus, setOptionHasFocus] = useState<boolean>(false)

   useEffect(() => {
      if (Array.isArray(value)) {
         if (value.length) {
            setHasValues(true)
         } else {
            setHasValues(false)
         }
      } else {
         if (value) {
            setHasValues(true)
         } else {
            setHasValues(false)
         }
      }
   }, [value])

   const { styles, attributes } = usePopper(refElement, popperElement, {
      placement: 'bottom-start',
      strategy: 'fixed',
      modifiers: [{ name: 'offset', options: { offset: [0, 5] } }]
   })

   const Value = useMemo(() => {
      if ((multiple && !hasValues) || (!multiple && !hasValues)) return <>{placeholder}</>

      if (multiple && hasValues) {
         return (
            <div className='flex gap-2 overflow-hidden'>
               <Pill>{value[0].label}</Pill>
               {value.length > 1 ? <Pill>+{value.length - 1}</Pill> : null}
            </div>
         )
      }

      if (!multiple && hasValues) {
         return <Pill>{value?.label}</Pill>
      }
   }, [value, multiple, hasValues])

   const selectOption = (option: SelectOption) => {
      if (multiple) {
         if (value.some(e => e.value === option.value)) {
            const arr = value.filter(o => o.value !== option.value)
            if (!arr.length) {
               setHasValues(false)
            }
            onChange(arr)
         } else {
            onChange([...value, option])
         }
      } else {
         onChange(option)
      }
   }

   const isOptionSelected = (option: SelectOption) => {
      return multiple ? value.some(e => e.value === option.value) : option.value === value?.value
   }

   const handleContainerClick = () => {
      setShowOptions(val => !val)
      !largeScreen && lockScreen()
   }

   const handleOptionClick = (e: React.MouseEvent<HTMLDivElement>, option: SelectOption) => {
      e.stopPropagation()
      selectOption(option)
      if (!multiple) {
         setShowOptions(false)
         unlockScreen()
      }
   }

   const handleClearValues = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setHasValues(false)
      multiple ? onChange([]) : onChange(undefined)
   }

   const handleClickOutsideContainer = () => {
      !optionHasFocus && setShowOptions(false)
   }

   const containerRef = useRef<HTMLDivElement>(null)
   useOutsideClick(containerRef, handleClickOutsideContainer, showOptions && largeScreen)

   return (
      <>
         <div
            className='relative mt-1 bg-white dark:bg-custom-navy-500 rounded-md shadow-md dark:shadow-none cursor-pointer text-base font-semibold px-4 py-2 h-10 w-full block'
            ref={setRefElement}
            tabIndex={0}
            role='select'
            aria-pressed={showOptions}
            aria-label={placeholder}
            aria-haspopup={true}
            onClick={handleContainerClick}
         >
            <div ref={containerRef} className='grid grid-cols-[auto_20px] items-center'>
               {Value}
               {hasValues ? (
                  <button className='h-full grid items-center justify-end' onClick={handleClearValues}>
                     <SvgAdd className='h-[70%] -rotate-45' />
                  </button>
               ) : (
                  <div className='h-full grid items-center justify-end'>
                     <SvgLeft className='h-[70%] -rotate-90' />
                  </div>
               )}
            </div>
         </div>

         {createPortal(
            <AnimatePresence initial={false}>
               {showOptions ? (
                  <>
                     {!largeScreen ? (
                        <motion.div
                           key={1}
                           initial={{ opacity: 0, pointerEvents: 'none' }}
                           animate={{ opacity: 1, pointerEvents: 'all' }}
                           exit={{ opacity: 0, pointerEvents: 'none' }}
                           transition={{ duration: 0.15 }}
                           className='fixed top-0 left-0 h-screen w-screen bg-black/40 dark:bg-black/50 backdrop-blur-sm z-[25] grid place-items-center'
                           onClick={() => {
                              setShowOptions(false)
                              unlockScreen()
                           }}
                        ></motion.div>
                     ) : null}
                     <motion.div
                        key={2}
                        initial={{ opacity: 0, pointerEvents: 'none', top: largeScreen ? -5 : '18vh' }}
                        animate={{ opacity: 1, pointerEvents: 'all', top: largeScreen ? 0 : '20vh' }}
                        exit={{ opacity: 0, pointerEvents: 'none', top: largeScreen ? -5 : '18vh' }}
                        transition={{ duration: 0.15 }}
                        ref={setPopperElement}
                        style={largeScreen ? styles.popper : {}}
                        {...attributes.popper}
                        className='fixed bg-white dark:bg-custom-navy-500 rounded-md shadow-md left-[5vw] w-[90vw] z-[31] opacity-1 p-3 sm:w-[80vw] sm:left-[10vw] md:w-[70vw] md:left-[15vw] lg:w-52'
                        onClick={e => e.stopPropagation()}
                        onMouseEnter={() => setOptionHasFocus(true)}
                        onMouseLeave={() => setOptionHasFocus(false)}
                     >
                        <div className='max-h-[60vh] overflow-auto overscroll-contain p-1 scrollbar-thin lg:max-h-[20rem]'>
                           <div className='whitespace-nowrap flex flex-col'>
                              <span className='text-lg text-custom-grey-200 dark:text-custom-slate-100 font-bold'>
                                 {placeholder}
                              </span>
                              {options.map(option => (
                                 <div
                                    key={option.value}
                                    aria-label={option.label}
                                    role='option'
                                    className='py-3 px-3 cursor-pointer rounded-md text-base duration-150 hover:bg-slate-100 hover:text-custom-blue-200 dark:hover:bg-custom-navy-100'
                                    onClick={e => handleOptionClick(e, option)}
                                    tabIndex={0}
                                 >
                                    <div
                                       className={`grid ${
                                          option.svg ? 'grid-cols-[25px_auto_20px]' : 'grid-cols-[auto_20px]'
                                       }`}
                                    >
                                       {option.svg ? (
                                          <div className='w-[20px] flex items-center justify-start'>{option.svg}</div>
                                       ) : null}
                                       <span className='text-left'>{option.label}</span>
                                       {isOptionSelected(option) ? (
                                          <div className='w-full h-[20px] bg-custom-blue-200 rounded-full grid place-items-center'>
                                             <SvgCheck className='text-custom-white-200 h-3/4' />
                                          </div>
                                       ) : null}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </motion.div>
                  </>
               ) : null}
            </AnimatePresence>,
            document.body
         )}
      </>
   )
}

export default Select
