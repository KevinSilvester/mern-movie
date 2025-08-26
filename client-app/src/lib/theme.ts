export default function () {
   if (localStorage.theme === 'dark') {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
   } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
   }
}
