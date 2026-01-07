"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { api } from "@/lib/api"
import { getLang } from "@/lib/storage"
import HlsVideo from "@/components/HlsVideo"
import Link from "next/link"
import { upsertContinue } from "@/lib/continue"
import QualitySheet, { QualityKey } from "@/components/QualitySheet"

function bestUrl(video: { video_480?: string; video_720?: string; video_1080?: string }, q: QualityKey) {
  if (q === "1080") return video.video_1080
  if (q === "720") return video.video_720
  if (q === "480") return video.video_480
  // auto: prefer 720 > 1080 > 480 (biar stabil)
  return video.video_720 ?? video.video_1080 ?? video.video_480
}

export default function WatchPage({ params, searchParams }: any) {
  const code = Number(params.code)
  const startEp = Number(searchParams?.ep ?? 1)

  const [lang, setLang] = useState("en")
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [currentIndex, setCurrentIndex] = useState(Math.max(0, startEp - 1))
  const [total, setTotal] = useState(1)
  const eps = useMemo(() => Array.from({ length: total }).map((_, i) => i + 1), [total])

  const [titleName, setTitleName] = useState("")
  const [cover, setCover] = useState("")
  const [quality, setQuality] = useState<QualityKey>("auto")
  const [sheetOpen, setSheetOpen] = useState(false)

  // simpan semua url per episode (video_480/720/1080)
  const [videoByEp, setVideoByEp] = useState<Record<number, { video_480?: string; video_720?: string; video_1080?: string }>>({})

  useEffect(() => {
    setLang(getLang("en"))
  }, [])

  // cover dari home sekali
  useEffect(() => {
    const run = async () => {
      const h = await api.home(lang)
      const it = (h.data ?? []).find((x) => x.code === code)
      if (it?.cover) setCover(it.cover)
    }
    run().catch(() => {})
  }, [code, lang])

  // load episode current + next (prefetch)
  useEffect(() => {
    const ep = currentIndex + 1
    const nextEp = ep + 1

    const load = async (targetEp: number) => {
      if (videoByEp[targetEp]) return
      const r = await api.play(code, lang, targetEp)
      setTitleName(r.data.name)
      setTotal(r.data.total)
      setVideoByEp((m) => ({ ...m, [targetEp]: r.data.video }))
    }

    load(ep).catch(() => {})
    if (nextEp <= total) load(nextEp).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, lang, currentIndex, total])

  // detect active slide (swipe up next via snap scroll)
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const items = Array.from(root.querySelectorAll("[data-slide='1']"))
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!best) return
        const idx = Number((best.target as HTMLElement).dataset.index)
        setCurrentIndex(idx)
      },
      { root, threshold: [0.6] }
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [eps.length])

  const goToIndex = (idx: number) => {
    const root = containerRef.current
    const el = root?.querySelector(`[data-index="${idx}"]`) as HTMLElement | null
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const goNext = () => goToIndex(Math.min(currentIndex + 1, eps.length - 1))

  // start at requested episode
  useEffect(() => {
    const idx = Math.max(0, startEp - 1)
    const t = setTimeout(() => goToIndex(idx), 50)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startEp])

  // continue watching save
  useEffect(() => {
    const ep = currentIndex + 1
    if (!titleName) return
    upsertContinue({ code, ep, name: titleName, cover: cover || "" })
  }, [currentIndex, code, titleName, cover])

  const currentEp = currentIndex + 1
  const currentVideo = videoByEp[currentEp] ?? {}
  const currentSrc = bestUrl(currentVideo, quality) ?? ""

  const available = [
    { q: "auto" as const, label: "Auto", url: "auto" },
    { q: "480" as const, label: "480p", url: currentVideo.video_480 },
    { q: "720" as const, label: "720p", url: currentVideo.video_720 },
    { q: "1080" as const, label: "1080p", url: currentVideo.video_1080 },
  ]

  return (
    <div className="relative bg-black">
      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 z-[60] p-3 flex items-center justify-between">
        <Link
          href={`/title/${code}`}
          className="rounded-full ui-panel ui-border px-4 py-2 text-sm ui-panel-hover inline-flex items-center gap-2"
        >
          <i className="ri-arrow-left-line" /> Detail
        </Link>

        <button
          onClick={() => setSheetOpen(true)}
          className="rounded-full ui-panel ui-border px-4 py-2 text-sm ui-panel-hover inline-flex items-center gap-2"
        >
          <i className="ri-hd-line" />
          {quality === "auto" ? "Auto" : `${quality}p`}
        </button>
      </div>

      {/* vertical snap container */}
      <div ref={containerRef} className="h-dvh overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        {eps.map((ep, idx) => {
          const v = videoByEp[ep] ?? {}
          const src = idx === currentIndex ? currentSrc : (bestUrl(v, "auto") ?? "")

          return (
            <div key={ep} data-slide="1" data-index={idx} className="relative h-dvh snap-start bg-black">
              <HlsVideo
                src={src}
                active={idx === currentIndex}
                onEnded={() => idx === currentIndex && goNext()}
              />

              {/* overlay minimal */}
              <div className="pointer-events-none absolute inset-0 bg-black/10" />

              {/* right controls */}
              <div className="absolute right-3 top-1/3 flex flex-col items-center gap-4">
                <button className="grid h-12 w-12 place-items-center rounded-full ui-panel ui-border ui-panel-hover">
                  <i className="ri-heart-3-line text-xl" />
                </button>
                <button className="grid h-12 w-12 place-items-center rounded-full ui-panel ui-border ui-panel-hover">
                  <i className="ri-share-forward-line text-xl" />
                </button>
                <button
                  onClick={() => setSheetOpen(true)}
                  className="rounded-full ui-panel ui-border px-3 py-2 text-xs ui-panel-hover inline-flex items-center gap-2"
                >
                  <i className="ri-settings-3-line" />
                  Quality
                </button>
                <button className="grid h-12 w-12 place-items-center rounded-full ui-panel ui-border ui-panel-hover">
                  <i className="ri-fullscreen-line text-xl" />
                </button>
              </div>

              {/* bottom text */}
              <div className="absolute bottom-6 left-4 right-4">
                <div className="text-2xl font-extrabold">{titleName || "…"}</div>
                <div className="ui-muted mt-1">Episode {ep}</div>
                <div className="text-xs ui-muted mt-3">
                  Swipe up untuk episode berikutnya • Auto-next saat video selesai
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <QualitySheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        current={quality}
        available={available}
        onPick={(q) => {
          setQuality(q)
          setSheetOpen(false)
        }}
      />
    </div>
  )
}