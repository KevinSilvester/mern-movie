const FilterItem: React.FC<{ title: string }> = ({ children, title }) => {
   return (
      <div className='snap-start w-[12.5rem] h-full pl-3'>
         <span className='text-xl font-bold py-2'>{title}</span>
         <div className='w-full relative'>{children}</div>
      </div>
   )
}

export default FilterItem
