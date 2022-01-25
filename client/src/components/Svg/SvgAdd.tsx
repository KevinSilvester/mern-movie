type Props = {
   className: string;
   onClick?: () => void;
   focusable?: boolean;
   role?: string;
   props?: any
}

const Svg: React.FC<Props> = ({ className, onClick, role = 'img', focusable = false, ...props }) => {
   return (
      <svg
         aria-hidden='true'
         focusable={focusable}
         data-prefix='fas'
         data-icon='plus'
         className={className}
         role={role}
         {...props}
         xmlns='http://www.w3.org/2000/svg'
         viewBox='0 0 448 512'
         onClick={onClick}
      >
         <path
            fill='currentColor'
            d='M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z'
         ></path>
      </svg>
   )
}

export default Svg
