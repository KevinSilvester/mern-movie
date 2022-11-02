import type { FilePondInitialFile } from 'filepond'
import type { MovieForm } from '@lib/types'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFilePoster from 'filepond-plugin-file-poster'
import axios from 'axios'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css'
import SvgExclamationTriangle from '@comp/Svg/SvgExclamationTriangle'
import { notifyError } from '@lib/toaster'

declare module 'filepond' {
   export interface FilePondFile {
      getFileEncodeBase64String: () => string | undefined
   }
}

registerPlugin(
   FilePondPluginImageExifOrientation,
   FilePondPluginImagePreview,
   FilePondPluginFileEncode,
   FilePondPluginFileValidateSize,
   FilePondPluginFileValidateType,
   FilePondPluginFilePoster
)

const InputImage: React.FC<{ edit: boolean }> = ({ children, edit }) => {
   const {
      formState: { isSubmitted, errors },
      setValue,
      clearErrors,
      setError,
      watch
   } = useFormContext<MovieForm>()
   const [files, setFiles] = useState<FilePondInitialFile[]>([])

   const UrlToFile = async (url: string): Promise<File> => {
      try {
         const { data } = await axios.get(url, { responseType: 'blob' })
         const file = new File([data], `${watch('title')}.poster`, { type: data.type })
         return file
      } catch {
         setValue('poster.image', '')
         throw new Error('Conversion Failed')
      }
   }

   const createDefault = async (): Promise<void> => {
      try {
         const file = await UrlToFile(watch('poster.image'))
         const fileArr: FilePondInitialFile[] = [
            {
               source: 'Input',
               options: {
                  type: 'local',
                  file: {
                     name: file.name,
                     size: file.size,
                     type: file.type
                  },
                  metadata: { poster: watch('poster.image') }
               }
            }
         ]
         setFiles(fileArr)
      } catch {
         setFiles([])
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
            <div className={`${isSubmitted && files.length === 0 ? 'ring-2 ring-red-500 rounded-md' : ''}`}>
               <FilePond
                  files={files}
                  name='image'
                  maxFiles={1}
                  maxFileSize={'5MB'}
                  acceptedFileTypes={['image/jpeg', 'image/png']}
                  allowMultiple={false}
                  allowFileSizeValidation={true}
                  onerror={() => notifyError('Oop! An error occured! (◎﹏◎)')}
                  onupdatefiles={storedFiles => {
                     if (storedFiles.length !== 0) {
                        const base64 = storedFiles[0].getFileEncodeBase64String()
                        const fileType = storedFiles[0].fileType

                        if (base64) {
                           const dataUrl = createDataUrl(fileType, base64)
                           setValue('poster.image', dataUrl)
                           clearErrors('poster.image')

                           setFiles(
                              storedFiles.map<FilePondInitialFile>(f => ({
                                 source: 'Input',
                                 options: {
                                    type: 'local',
                                    file: {
                                       name: f.filename,
                                       size: f.fileSize,
                                       type: f.fileType
                                    },
                                    metadata: { poster: dataUrl }
                                 }
                              }))
                           )
                        }
                     } else {
                        setValue('poster.image', undefined!)
                        setError('poster.image', { message: 'Poster cannot be empty!' })
                        setFiles([])
                     }
                  }}
                  labelIdle={`
                           <span class='font-semibold text-xl text-white cursor-pointer w-full h-full'>
                              Drag & Drop your files or <span class="underline underline-offset-1 decoration-2">Browse</span>
                           </span>
                        `}
               />
            </div>
            {isSubmitted && files.length === 0 ? (
               <span className='text-sm text-red-500 px-2 py-1 mt-1 h-7 w-fit bg-red-50 rounded-md flex gap-x-2 items-center'>
                  <SvgExclamationTriangle className='h-2/3' />
                  <span>{errors.poster?.image && errors.poster?.image.message}</span>
               </span>
            ) : null}
         </div>
      </>
   )
}

export default InputImage
