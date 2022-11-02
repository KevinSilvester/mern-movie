import SvgExclamation from '@comp/Svg/SvgExclamation'

const Warning: React.FC = () => {
   return (
      <div className='absolute top-2 right-2 z-10 h-5 w-5 md:h-7 md:w-7 rounded-full opacity-90 bg-custom-white-100 grid   place-items-center border-2 border-red-500 before:absolute before:h-full before:w-full before:z-[5] before:rounded-full group hover:opacity-100 hover:before:animate-ping hover:before:bg-red-400'>
         <div className='absolute top-0 left-0 h-full w-full rounded-full'></div>
         <div className='absolute top-[20px] right-[1px] md:top-[30px] md:right-[6px] h-fit bg-custom-white-100 w-[5.7rem] md:w-[7rem] text-[0.67rem] md:text-[0.8rem] p-1 rounded-sm border-red-500 border-[1px] text-red-500 shadow-sm shadow-red-400 duration-150 opacity-0 select-none pointer-events-none group-hover:opacity-100'>
            This image is a fallback image from an external server. Upload a new image to
            improve load time.
         </div>
         <SvgExclamation className='h-3/4 text-red-500' />
      </div>
   )
}

export default Warning
