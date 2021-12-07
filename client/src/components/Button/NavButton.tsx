import { Link } from 'react-router-dom'
import style from './NavButton.module.css'

const NavButton: React.FC<{ active?: boolean; path: string }> = ({ children, active, path }) => {
   return (
      <Link
         to={path}
         className={`h-full w-1/2 grid place-items-center transition-all duration-200 rounded-lg ${
            active ? style.active : style.inactive
         }`}
      >
         {children}
      </Link>
   )
}

export default NavButton
