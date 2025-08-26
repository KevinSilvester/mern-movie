import type { MovieForm } from '@lib/types'
import type { FilePondFile, FilePondInitialFile } from 'filepond'
import { useEffect, useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import { useFormContext } from 'react-hook-form'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import FilePondPluginFilePoster from 'filepond-plugin-file-poster'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import axios from 'axios'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css'
import SvgExclamationTriangle from '@comp/Svg/SvgExclamationTriangle'
import { notifyError, notifyLoading, updateLoading } from '@lib/toaster'

declare module 'filepond' {
   export interface FilePondFile {
      getFileEncodeBase64String: () => string
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

const FILEPOND_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif']
const FILEPOND_IMAGE_MAX_SIZE = '5MB' // 5MB
const FILEPOND_IMAGE_LABEL_IDLE = `
   <span class='font-semibold text-xl text-white cursor-pointer w-full h-full'>
      Drag & Drop your files or <span class="underline underline-offset-1 decoration-2">Browse</span>
   </span>
`

const urlToFile = async (url: string, fileName: string): Promise<File> => {
   try {
      const { data } = await axios.get(url, { responseType: 'blob' })
      console.log(data.type)
      const file = new File([data], `${fileName} - ${Date.now()}`, { type: data.type })
      return file
   } catch {
      throw new Error('File download failed')
   }
}

const InputImage: React.FC<{ edit: boolean }> = ({ children, edit }) => {
   const {
      formState: { isSubmitted, errors },
      setValue,
      clearErrors,
      setError,
      watch
   } = useFormContext<MovieForm>()
   const [files, setFiles] = useState<FilePondInitialFile[]>([])

   const createDefault = async (): Promise<void> => {
      try {
         notifyLoading('Loading poster...', { toastId: 'poster', isLoading: true })
         const posterString = watch('poster_string') as string
         const file = await urlToFile(posterString, watch('title') || 'poster')
         const initialFile: FilePondInitialFile = {
            source: posterString,
            options: {
               type: 'local',
               file: {
                  name: file.name,
                  size: file.size,
                  type: file.type
               },
               metadata: { poster: posterString }
            }
         }
         updateLoading('poster', 'Poster loaded!', true)
         setFiles([initialFile])
      } catch {
         setFiles([])
         updateLoading('poster', 'Failed to load poster! (◎﹏◎)', false)
      }
   }

   useEffect(() => {
      if (edit && watch('poster_string')) {
         createDefault()
      }
      const subscription = watch(data => {
         isSubmitted && !data.poster_string
            ? setError('poster_string', { message: 'Poster cannot be empty!' })
            : clearErrors('poster_string')
      })
      return () => subscription.unsubscribe()
   }, [edit, watch('poster_string')])

   const onUpdateFiles = (storedFiles: FilePondFile[]) => {
      if (storedFiles.length !== 0) {
         const dataUrl = storedFiles[0].getFileEncodeDataURL()

         if (dataUrl) {
            setValue('poster_string', dataUrl)
            clearErrors('poster_string')
            const file = storedFiles[0].file

            setFiles([
               {
                  source: dataUrl,
                  options: {
                     type: 'local',
                     file: {
                        name: file.name,
                        size: file.size,
                        type: file.type
                     },
                     metadata: { poster: dataUrl }
                  }
               }
            ])
         }
      } else {
         setValue('poster_string', undefined)
         setError('poster_string', { message: 'Poster cannot be empty!' })
         setFiles([])
      }
   }

   return (
      <div className='flex flex-col'>
         {children}
         <div className={`${errors.poster_string ? 'ring-2 ring-red-500 rounded-md' : ''}`}>
            <FilePond
               files={files}
               name='image'
               maxFiles={1}
               maxFileSize={FILEPOND_IMAGE_MAX_SIZE}
               acceptedFileTypes={FILEPOND_IMAGE_TYPES}
               allowMultiple={false}
               allowFileSizeValidation={true}
               onerror={() => notifyError('Oop! An error occured! (◎﹏◎)')}
               onupdatefiles={onUpdateFiles}
               labelIdle={FILEPOND_IMAGE_LABEL_IDLE}
            />
         </div>
         {errors.poster_string && (
            <span className='text-sm text-red-500 px-2 py-1 mt-1 h-7 w-fit bg-red-50 rounded-md flex gap-x-2 items-center'>
               <SvgExclamationTriangle className='h-2/3' />
               <span>{errors.poster_string?.message}</span>
            </span>
         )}
      </div>
   )
}

export default InputImage
