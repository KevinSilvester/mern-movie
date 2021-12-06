import Navbar from '@comp/Navbar/Navbar'
import Search from '@comp/Search/Search'
import React from 'react'

const Layout: React.FC = ({ children }) => {
   return (
      <>
         <div className="relative mt-6 mb-14 h-5 w-screen flex flex-col">
            <h1 className=''>MoiveDB</h1>
            <Search />
         </div>
         {children}
         <Navbar />
      </>
   )
}

export default Layout
