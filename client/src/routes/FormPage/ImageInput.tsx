import type { FilePondFile } from 'filepond'
import type { FormValues } from '.'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import SvgExclamationTriangle from '@comp/Svg/SvgExclamationTriangle'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(
   FilePondPluginImageExifOrientation,
   FilePondPluginImagePreview,
   FilePondPluginFileEncode,
   FilePondPluginFileValidateSize,
   FilePondPluginFileValidateType
)
const ImageInput: React.FC = ({ children }) => {
   const { formState, setValue, clearErrors } = useFormContext<FormValues>()
   const [files, setFiles] = useState<FilePondFile[]>([])

   useEffect(() => {
      // @ts-ignore
      if (files.length !== 0) {
         // @ts-ignore
         setValue('image', `data:${files[0].fileType};base64,${files[0].getFileEncodeBase64String()}`)
         clearErrors('image')
      } else {
         setValue('image', undefined!)
      }
   }, [files])

   return (
      <>
         <div className='flex flex-col'>
            {children}
            <div className={`${formState.isSubmitted && files.length === 0 ? 'ring-2 ring-red-500 rounded-md' : ''}`}>
               <FilePond
                  maxFiles={1}
                  acceptedFileTypes={['image/jpeg', 'image/png']}
                  allowMultiple={false}
                  name='image'
                  allowFileSizeValidation={true}
                  maxFileSize={'5MB'}
                  onupdatefiles={file => {
                     setFiles(file)
                  }}
                  onerror={() => console.log('hello')}
                  labelIdle={`
                           <span class='font-semibold text-xl text-white cursor-pointer w-full h-full'>
                              Drag & Drop your files or <span class="underline underline-offset-1 decoration-2">Browse</span>
                           </span>
                        `}
               />
            </div>
            {(formState.isSubmitted && files.length === 0) && (
               <span className='text-sm text-red-500 px-2 py-1 mt-1 h-7 w-fit bg-red-50 rounded-md flex gap-x-2 items-center'>
                  <SvgExclamationTriangle className='h-2/3' />
                  <span>Poster cannot be empty</span>
               </span>
            )}
         </div>
      </>
   )
}

export default ImageInput
