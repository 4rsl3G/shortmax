"use client"

import { useEffect, useRef } from "react"
import Hls from "hls.js"

export default function HlsVideo({
  src,
  active,
  onEnded,
}: {
  src: string
  active: boolean
  onEnded: () => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    const prevTime = video.currentTime || 0

    // cleanup old hls
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
    } else if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)
    } else {
      video.src = src
    }

    // restore time (best-effort)
    const t = setTimeout(() => {
      try {
        video.currentTime = prevTime
      } catch {}
    }, 300)

    return () => clearTimeout(t)
  }, [src])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) v.play().catch(() => {})
    else v.pause()
  }, [active])

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover"
      playsInline
      controls={false}
      onEnded={onEnded}
      preload="metadata"
    />
  )
}