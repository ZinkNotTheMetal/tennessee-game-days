'use client'

import { IConvention } from "@repo/shared"
import { useRouter } from "next/navigation"

interface IConventionSelectDropdownProps {
  currentConvention: number
  conventionList: IConvention[]
}

export default function ConventionSelectDropdown({ currentConvention, conventionList }: IConventionSelectDropdownProps) {
  const router = useRouter()

  return(
    <div className="flex justify-center items-center">
      <div className="relative w-full py-4 inline-block">
        <select
          className="block appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          value={currentConvention}
          onChange={(e) => {
            router.push(`/play-to-win/${e.target.value}`)
          }}
        >
          {conventionList.map((convention) => (
            <option value={convention.id} selected={convention.id === currentConvention}>{convention.name}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 fill-current text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
