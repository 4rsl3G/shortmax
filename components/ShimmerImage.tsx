"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"

export default function ShimmerImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative h-full w-full">
      {!loaded && <div className="absolute inset-0 shimmer" />}
      <Image {...props} onLoadingComplete={() => setLoaded(true)} />
    </div>
  )
}