import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useStore from '@store/useStore'
import Header from './Header/Header'
import Navbar from './Navbar/Navbar'

const Layout: React.FC = ({ children }) => {
   const { actions } = useStore(state => state)

   return (
      <div>
         <Header />
         {children}
         <Navbar />
      </div>
   )
}

export default Layout
