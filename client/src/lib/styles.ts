import { css, keyframes } from '@emotion/react'

export const slide = keyframes`
      from {
         transform: translateX(-100%);
      }
      to {
         transform: translateX(75%)
      }
   `

export const loader = css`
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
