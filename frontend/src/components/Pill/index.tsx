const Pill: React.FC = ({ children }) => (
   <div className='flex items-center gap-1 text-base bg-custom-slate-50 dark:bg-custom-navy-100 w-fit px-2 text-center rounded-md'>
      {children}
   </div>
)

export default Pill
