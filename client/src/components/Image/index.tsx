/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import type { PageContextType } from '@routes/MoviePage/PageContext'
import React, { useState, useContext } from 'react'
import Warning from '@comp/Warning'
import { css, jsx } from '@emotion/react'
import { loader } from '@lib/styles'
import { notifyError } from '@lib/toaster'

type Props = {
   title: string
   image: string
   fallback: string
   context: React.Context<PageContextType>
}

const Image: React.FC<Props> = ({ title, image, fallback, context }) => {
   const { loaded, setLoaded } = useContext(context)
   const [error, setError] = useState<boolean>(false)

   return (
      <>
         {error && <Warning />}
         <img
            src={image}
            alt={title}
            loading='lazy'
            className='h-full object-cover absolute top-0 left-0 w-full z-0'
            onLoad={() => setLoaded(true)}
            onError={e => {
               e.currentTarget.src = fallback
               notifyError('Poster image link is broken!')
               setError(true)
            }}
            css={css`
               opacity: ${!loaded && 0};
            `}
         />
         {!loaded && (
            <div className='h-full object-cover absolute top-0 left-0 w-full z-0' css={loader} />
         )}
      </>
   )
}

export default Image
