/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag */
import type { Dispatch, SetStateAction } from 'react'
import React, { useState, useMemo, createContext, useEffect, useRef } from 'react'
import { jsx } from '@emotion/react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import _404Page from '@routes/_404Page'
import NavSecondary from '@comp/NavSecondary'
import { loader } from '@lib/styles'
import { getMovie } from '@lib/api'
import PageHeader from './PageHeader'
import PageContent from './PageContent'
import SvgYoutube from '@comp/Svg/SvgYoutube'
import { notifyError } from '@lib/toaster'
import PageIframe from './PageIframe'

const MoviePage: React.FC = () => {
   const { id } = useParams()
   const { isError, isFetched, data } = useQuery(['movie', id], () => getMovie(id as string), {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0
   })

   useEffect(() => {
      window.scrollTo(0, 0)
   }, [id])

   if (isError) {
      return <_404Page />
   }

   return (
      <>
         <NavSecondary />
         <main
            className={`px-5 h-auto w-full md:w-2xl mt-24 mx-auto lg:px-0 lg:w-full lg:max-w-5xl lg:mt-24 lg:mx-auto`}
         >
            <PageHeader movie={data?.movie} isFetched={isFetched} />
            <PageIframe movie={data?.movie} isFetched={isFetched} />
            <PageContent movie={data?.movie} isFetched={isFetched} />
         </main>
      </>
   )
}

export default MoviePage
