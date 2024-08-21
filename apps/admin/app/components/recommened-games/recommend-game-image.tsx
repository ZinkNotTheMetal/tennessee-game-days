'use client'

import Image from "next/image"

interface RecommendedGameImageProps {
  src: string
  gameName: string
}

export default function RecommendedGameImage({ src, gameName }: RecommendedGameImageProps) : JSX.Element {

  return (
    <Image
      src={src}
      alt={`Image for ${gameName}`}
      priority={true}
      fill={true}
      className="rounded"
    />
  )
}
