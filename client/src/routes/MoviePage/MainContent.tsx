import type { ApiResponse } from "@lib/types"
import { useContext } from "react"
import { PageContext } from "./PageContext"

const MainContent: React.FC<{ movie: ApiResponse['movie'] }> = ({ movie }) => {
   const { loaded, setLoaded } = useContext(PageContext)
   
   return (
      <section className='mt-6'>
         <div aria-label='Plot Section'>
            <span>Plot</span>
         </div>
         <div aria-label='Year Section'>
            <span>Year</span>
         </div>
         <div aria-label='Genres Section'>
            <span>Genres</span>
         </div>
         <div aria-label='Actors Section'>
            <span>Actors</span>
         </div>
         <div aria-label='Director Section'>
            <span>Director</span>
         </div>
         <div aria-label='Runtime Section'>
            <span>Runtime</span>
         </div>
      </section>
   )
}

export default MainContent
