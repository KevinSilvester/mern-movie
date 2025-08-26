/** @jsxRuntime classic */
/** @jsx jsx */

import type { Movie } from '@lib/types'
import { useEffect, useRef } from 'react'
import { jsx } from '@emotion/react'
import SvgYoutube from '@comp/Svg/SvgYoutube'
import { loader } from '@lib/styles'
import { notifyError } from '@lib/toaster'

const PageIframe: React.FC<{ movie?: Movie; isFetched: boolean }> = ({ movie, isFetched }) => {
   const iframeRef = useRef<HTMLIFrameElement>(null)

   useEffect(() => {
      if (isFetched && movie?.tmdb.youtube_link)
         iframeRef.current?.setAttribute('src', movie?.tmdb.youtube_link as string)

      if (movie?.tmdb.youtube_link === null) notifyError('No trailer found! ㄟ( ▔, ▔ )ㄏ')
   }, [isFetched])

   return (
      <section className='mt-5 w-full aspect-video rounded-md shadow-md dark:shadow-none relative grid place-items-center bg-black overflow-hidden lg:mt-0 lg:!w-[38rem] lg:absolute lg:translate-x-[26rem] lg:translate-y-6'>
         <iframe
            src=''
            ref={iframeRef}
            title={`${movie?.title} Trailer`}
            className={`w-full h-full absolute ${isFetched ? 'visible' : 'invisible'}`}
            loading='lazy'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
         ></iframe>
         {(!isFetched || !movie?.tmdb.youtube_link) && (
            <div
               className='w-full h-full absolute overflow-hidden rounded-md grid place-items-center z-20'
               css={loader}
               onClick={() => {
                  if (movie?.tmdb.youtube_link === null) notifyError('No trailer found! ㄟ( ▔, ▔ )ㄏ')
               }}
            >
               <SvgYoutube className='h-2/3 absolute z-20 opacity-30' />
            </div>
         )}
      </section>
   )
}

export default PageIframe
