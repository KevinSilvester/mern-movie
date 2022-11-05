/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import React, { useState } from 'react'
import { css, jsx } from '@emotion/react'
import Warning from '@comp/Warning'
import { loader } from '@lib/styles'
import { notifyError } from '@lib/toaster'

type Props = {
   title: string
   image: string
   fallback: string
}

const Image: React.FC<Props> = ({ title, image, fallback }) => {
   const [loaded, setLoaded] = useState<boolean>(false)
   const [error, setError] = useState<boolean>(false)

   return (
      <>
         {error && <Warning />}
         <img
            src={image}
            alt={title}
            className='h-full object-cover absolute top-0 left-0 w-full z-0'
            onLoad={() => setLoaded(true)}
            onError={e => {
               e.currentTarget.src = fallback
               notifyError('Poster image link is broken! ㄟ( ▔, ▔ )ㄏ')
               setError(true)
            }}
            css={
               !loaded &&
               css`
                  opacity: 0;
               `
            }
         />
         {!loaded && <div className='h-full object-cover absolute top-0 left-0 w-full z-0' css={loader} />}
      </>
   )
}

export default Image
