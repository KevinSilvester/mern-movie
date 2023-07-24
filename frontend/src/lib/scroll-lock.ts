export const lockScreen = () => {
   const body = document.body
   body.style.overflow = 'hidden'
   body.style.height = '100vh'
}

export const unlockScreen = () => {
   const body = document.body
   body.style.overflow = ''
   body.style.height = ''
}
