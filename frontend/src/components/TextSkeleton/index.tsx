/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react'
import { loader } from '@lib/styles'

const TextSkeleton: React.FC<{ className: string }> = ({ className }) => (
   <div className={`${className} shadow-md dark:shadow-none rounded-md`}>
      <div className='w-full h-full rounded-md overflow-hidden' css={loader}></div>
   </div>
)

export default TextSkeleton
