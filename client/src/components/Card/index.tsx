/** @jsxRuntime classic */
/** @jsx jsx */
import { useRef, useState } from 'react'
import { css, jsx, keyframes } from '@emotion/react'
import { Movie } from '@lib/types'
import { Link } from 'react-router-dom'
import { useFloating, shift } from '@floating-ui/react-dom'
import SvgExclamation from '@comp/Svg/SvgExclamation'

const Card: React.FC<{ movie: Movie }> = ({ movie }) => {
   const [loaded, setLoaded] = useState<boolean>(false)
   const [error, setError] = useState<boolean>(false)
   const arrowRef = useRef<HTMLDivElement>(null)
   const {
      reference: ref1,
      floating: float1,
      strategy: strat1
   } = useFloating({
      placement: 'top-end',
      middleware: [shift()]
   })
   const {
      reference: ref2,
      floating: float2,
      strategy: strat2
   } = useFloating({
      placement: 'left-start',
      middleware: [shift()]
   })

   const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = movie.poster.fallback
      setError(true)
   }

   const slide = keyframes`
      from {
         transform: translateX(-100%);
      }
      to {
         transform: translateX(50%)
      }
   `

   const loader = css`
      background: var(--skeleton-bg);
      &::before {
         content: '';
         display: block;
         height: 100%;
         width: 200%;
         transform: translateX(0);
         background: linear-gradient(
            90deg,
            var(--skeleton-bg) 0%,
            var(--skeleton-fg) 40%,
            var(--skeleton-fg) 65%,
            var(--skeleton-bg) 100%
         );
         animation: ${slide} 2s linear infinite;
      }
   `

   return (
      <Link to={`movie/${movie._id}`} className='grid grid-rows-[min-content_auto] relative w-full'>
         <div
            ref={ref1}
            className={`transition-all rounded-md inline-block relative w-full z-10 overflow-hidden shadow-custom-navy-600/10 shadow-md drop-shadow-md dark:shadow-none dark:drop-shadow-none aspect-[10/16]`}
         >
            {error && (
               <div
                  ref={float1}
                  style={{ position: strat1, top: 7, right: 7 }}
                  className='z-10 h-5 w-5 md:h-7 md:w-7 rounded-full relative bg-custom-white-100 grid place-items-center border-2 border-red-500 before:absolute before:h-full before:w-full before:bg-red-400 before:animate-ping before:z-[5] before:rounded-full group'
               >
                  <div ref={ref2} className='absolute top-0 left-0 h-full w-full rounded-full'></div>
                  <div
                     ref={float2}
                     className='absolute top-[20px] right-[1px] md:top-[30px] md:right-[6px] h-fit bg-custom-white-100 w-[5.7rem] md:w-[7rem] text-[0.67rem] md:text-[0.8rem] p-1 rounded-sm border-red-500 border-[1px] text-red-500 shadow-sm shadow-red-400 duration-150 opacity-0 select-none pointer-events-none group-hover:opacity-100'
                  >
                     This image is a fallback image from an external server. Replace the broken
                     image link to improve load time.
                  </div>
                  <SvgExclamation className='h-3/4 text-red-500' />
               </div>
            )}
            <img
               src={movie.poster.image}
               alt={movie.title}
               loading='lazy'
               className='shadow-center h-full object-cover absolute top-0 left-0 w-full z-0'
               onLoad={() => setLoaded(true)}
               onError={e => handleError(e)}
               css={css`
                  opacity: ${!loaded && 0};
               `}
            />
            {!loaded && (
               <div className='h-full object-cover absolute top-0 left-0 w-full z-0' css={loader} />
            )}
         </div>
         <div
            className={`text-left text-[0.8rem] lg:text-xl mt-2 relative ${
               loaded ? 'w-fit h-fit' : 'h-4 md:h-6 w-[80%] overflow-hidden rounded-md'
            }`}
            css={!loaded && loader}
         >
            {movie.title}
         </div>
      </Link>
   )
}

export default Card
