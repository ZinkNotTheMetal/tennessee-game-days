'use client'

import Image from "next/image"

interface RecommendedGameImageProps {
  src: string
  gameName: string
  isCheckedOut: boolean
}

export default function RecommendedGameImage({ src, gameName, isCheckedOut }: RecommendedGameImageProps) : JSX.Element {

  return (
    <Image
      src={src}
      alt={`Image for ${gameName}`}
      priority={true}
      fill={true}
      className={`${isCheckedOut ? "rounded opacity-15" : "rounded"}`}
    />
  )
}
