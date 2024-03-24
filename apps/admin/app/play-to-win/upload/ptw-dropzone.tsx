'use client'

import { ApiListResponse, IConvention } from "@repo/shared"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useDropzone } from 'react-dropzone'
import { FaUpload } from "react-icons/fa6"

export default function PlayToWinDropZone() : JSX.Element {
  const [conventions, setConventions] = useState<IConvention[] | undefined>(undefined)
  const [conventionSelected, setConventionSelected] = useState<number>(-1)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    console.log(file)
  }, [])

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  useEffect(() => {
    fetch(`/api/convention/list/`,
    {
      method: "GET"
    })
    .then((response) => {
      return response.json()
    })
    .then((json: ApiListResponse<IConvention>) => {
      setConventions(json.list)
    })

  }, [])

  const uploadCsvToPtwApi = () => {
    const playToWinFile = acceptedFiles[0]

    if (playToWinFile === undefined) return

    const formData = new FormData()
    formData.append('conventionId', conventionSelected.toString())
    if (playToWinFile) {
      formData.append('csvFile', playToWinFile)
    }

    toast(`Beginning the process to upload games. Please be patient as this can take a while...`, { type: 'info' })

    fetch(`/api/play-to-win/add`, {
      method: "POST",
      body: formData
    })
      .then((response) => {
        if (response.ok) {
          toast(`Successfully uploaded ${playToWinFile.name} for play-to-win games`, { type: 'success' })
        } else {
          console.log(response)
          toast(`Failed to upload ${playToWinFile.name}`, { type: 'error' })
        }
      })
      .catch((error) => {
        console.log(error)
        toast(`Failed to upload ${playToWinFile.name}`, { type: 'error' })
      })

    router.push('/play-to-win')
  }



  return (
    <section className="grid columns-1">
      <div className="flex items-center justify-center">
        <div {...getRootProps({className: 'dropzone'})} className="flex flex-col w-1/2 items-center justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer border-2 border-dashed border-gray-500 p-4 rounded-lg">
          <input {...getInputProps()} />
          <FaUpload className="h-28 w-14 py-2" />
          { isDragActive ? (
            <p>Drop the file here...</p>
          ) : 
          (
            <p>Drag 'n' drop a file here, or click here and select a file to upload.</p>
          )}
        </div>

      </div>

      <div className="w-1/2 mx-auto">
        <div className="text-center py-2">
        { acceptedFiles.map((file, index) => (
          <span key={`${file.name}-${index}`}><span>{file.name}</span>- {file.size} bytes</span>
        )) }
        </div>
        <div className="flex justify-center items-center">
          <div className="relative w-full py-4 inline-block">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              defaultValue={conventionSelected}
              onChange={(e) => setConventionSelected(Number(e.target.value))}
            >
              <option value="-1" disabled className="text-gray-500">Select a convention</option>
                {conventions?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 fill-current text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <button
            className={`${conventionSelected === -1 ? 'disabled bg-gray-300 pointer-events-none' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded ml-4`}
            onClick={(e) => uploadCsvToPtwApi()}
          >
            Upload
          </button>

        </div>
      </div>

      
    </section>

  )
}
