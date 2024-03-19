'use client'

import { useRouter } from "next/navigation"


export default function PlayToWinItemUploadButton() {
  const router = useRouter()
  return(
    <button
      onClick={() => router.push('/play-to-win/upload')}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
    >
      Upload
    </button>
  )
}

