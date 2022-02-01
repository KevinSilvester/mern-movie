import type { ActualFileObject, FilePondFile } from 'filepond'
import type { MovieForm } from '@lib/types'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import SvgExclamationTriangle from '@comp/Svg/SvgExclamationTriangle'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFilePoster from 'filepond-plugin-file-poster'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css'
import axios from 'axios'
import { notifyError } from '@lib/toaster'

registerPlugin(
   FilePondPluginImageExifOrientation,
   FilePondPluginImagePreview,
   FilePondPluginFileEncode,
   FilePondPluginFileValidateSize,
   FilePondPluginFileValidateType,
   FilePondPluginFilePoster
)

const InputImage: React.FC<{ edit: boolean }> = ({ children, edit }) => {
   const { formState, setValue, clearErrors, setError, watch } = useFormContext<MovieForm>()
   const [file, setFile] = useState<FilePondFile[]>([])

   const UrlToFile = async (url: string): Promise<File> =>
      new Promise(async (resolve, reject) => {
         try {
            const { data } = await axios.get(url, { responseType: 'blob' })
            const file = new File([data], `${watch('title')}.poster`, { type: data.type })
            resolve(file)
         } catch {
            setValue('poster.image', '')
            reject(file)
         }
      })

   const createDefault = async (): Promise<void> => {
      try {
         const file = await UrlToFile(watch('poster.image'))
         const fileArr = [{
            source: 'DummySource',
            options: {
               type: 'local',
               file,
               metadata: { poster: watch('poster.image') }
            }
         }]
         setFile(fileArr as any)
      } catch {
         setFile([])
      }
   }

   const createDataUrl = (type: string, base64: string): string => `data:${type};base64,${base64}`

   useEffect(() => {
      if (edit && watch('poster.image')) {
         createDefault()
      }
   }, [edit, watch('poster.image')])

   return (
      <>
         <div className='flex flex-col'>
            {children}
            <div
               className={`${
                  formState.isSubmitted && file.length === 0 ? 'ring-2 ring-red-500 rounded-md' : ''
               }`}
            >
               <FilePond
                  // @ts-ignore
                  files={file}
                  maxFiles={1}
                  acceptedFileTypes={['image/jpeg', 'image/png']}
                  allowMultiple={false}
                  name='image'
                  allowFileSizeValidation={true}
                  maxFileSize={'5MB'}
                  onerror={() => console.log('error')}
                  onupdatefiles={files => {
                     setFile(files)
                     if (files.length !== 0) {
                        // @ts-ignore
                        const base64 = createDataUrl(files[0].fileType, files[0].getFileEncodeBase64String())
                        // @ts-ignore
                        const check = files[0].getFileEncodeBase64String() === undefined

                        if (!check) {
                           console.log('valid')
                           setValue('poster.image', base64)
                           clearErrors('poster.image')
                        }
                     } else {
                        console.log('invalid2')
                        setValue('poster.image', undefined!)
                        setError('poster.image', { message: 'Poster cannot be empty!' })
                     }
                  }}
                  labelIdle={`
                           <span class='font-semibold text-xl text-white cursor-pointer w-full h-full'>
                              Drag & Drop your files or <span class="underline underline-offset-1 decoration-2">Browse</span>
                           </span>
                        `}
               />
            </div>
            {formState.isSubmitted && file.length === 0 && (
               <span className='text-sm text-red-500 px-2 py-1 mt-1 h-7 w-fit bg-red-50 rounded-md flex gap-x-2 items-center'>
                  <SvgExclamationTriangle className='h-2/3' />
                  <span>
                     {formState.errors.poster?.image && formState.errors.poster?.image.message}
                  </span>
               </span>
            )}
         </div>
      </>
   )
}

export default InputImage
