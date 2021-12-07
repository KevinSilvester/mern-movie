import { Link } from "react-router-dom"

const _404Page: React.FC = () => {
   return (
      <>
         <div>
            <h1>404 - Not Found!</h1>
            <Link to='/'>Go Home</Link>
         </div>
      </>
   )
}

export default _404Page
