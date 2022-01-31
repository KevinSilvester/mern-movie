import type { Variants } from "framer-motion"

export const popperVariants: Variants = {
   hidden: { opacity: 0, pointerEvents: 'none', top: -5 },
   visible: { opacity: 1, pointerEvents: 'all', top: 0 }
}

export const modalVariants: Variants = {
   hidden: { opacity: 0, y: -15 },
   visible: { opacity: 1, y: 0 },
}

export const backToTopVariants: Variants = {
   hidden: { y: 10, opacity: 0, pointerEvents: 'none' },
   visible: { y: 0, opacity: 1, pointerEvents: 'auto' }
}