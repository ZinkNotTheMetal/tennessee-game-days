'use client'

import { ChangeEvent, useState } from "react"
import { FaUpload } from "react-icons/fa6";

interface DropzoneProps {
  allowedFileTypes: string,
  setSelectedFile: React.Dispatch<React.SetStateAction<File | undefined>>
}

export default function Dropzone( { allowedFileTypes, setSelectedFile }: DropzoneProps): JSX.Element {
  const [fileName, setFileName] = useState<string>()

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile: File | null = event.target.files?.[0] || null

    if (selectedFile !== null) {
      setSelectedFile(selectedFile)
      setFileName(selectedFile.name)
    } 
  }

  return(
    <>
      <div className="flex justify-center items-center">
        <label
          htmlFor="file-upload"
          className="flex flex-col w-1/2 items-center justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer border-2 border-dashed border-gray-500 p-4 rounded-lg"
        >
          <FaUpload className="h-14 w-14 py-2" />

          {fileName ? (
            <span className="text-lg text-gray-500">{fileName}</span>
          ) : (
            <span className="text-lg text-gray-500">Drag and drop or click to upload a file</span>
          )}
          <input id="file-upload" type="file" accept={allowedFileTypes} className="hidden" onChange={handleFileSelected} />
        </label>
      </div>
    </>
  )
}