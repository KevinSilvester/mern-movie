import Search from '@comp/Search/Search'

const Header = () => {
   return (
      <>
         <div className='relative mt-6 mb-8 h-5 w-screen text-center'>
            <h1 className='font-cursive text-2xl text-blue-500'>MovieDB</h1>
         </div>
         <Search />
      </>
   )
}

export default Header
