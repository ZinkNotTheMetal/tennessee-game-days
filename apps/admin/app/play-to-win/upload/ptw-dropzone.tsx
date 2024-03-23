'use client'

import Dropzone from "@/app/components/drop-zone/drop-zone"
import { ApiListResponse, IConvention } from "@repo/shared"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function PlayToWinDropZone() : JSX.Element {
  const [fileUploaded, setFileUploaded] = useState<File | undefined>()
  const [conventions, setConventions] = useState<IConvention[] | undefined>(undefined)
  const [conventionSelected, setConventionSelected] = useState<number>(-1)
  const router = useRouter()

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

  const uploadCsvToPtwApi = (file: File) => {

    const formData = new FormData()
    formData.append('conventionId', conventionSelected.toString())
    if (fileUploaded) {
      formData.append('csvFile', fileUploaded)
    }

    toast(`Play to win games take up to a minute to show up as the file is processing.`, { type: 'info' })

    fetch(`/api/play-to-win/add`, {
      method: "POST",
      body: formData
    })
      .then((response) => {
        if (response.ok) {
          toast(`Successfully uploaded ${file.name} for play-to-win games`, { type: 'success' })
        } else {
          toast(`Failed to upload ${file.name}`, { type: 'error' })
        }
      })
      .catch((error) => {
        console.log(error)
        toast(`Failed to upload ${file.name}`, { type: 'error' })
      })

    router.push('/play-to-win')
  }

  return (
    <div>
      <Dropzone
        allowedFileTypes=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        setSelectedFile={setFileUploaded}
      />
      {fileUploaded && (
        <div className="flex justify-center items-center pt-6">
          <div className="w-1/3">
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
          </div>
          <button
            className={`${conventionSelected === -1 ? 'disabled bg-gray-300 pointer-events-none' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded ml-4`}
            onClick={() => uploadCsvToPtwApi(fileUploaded)}
          >
            Upload
          </button>
        </div>
      )}
    </div>
  )
}
