"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import TopBar from "@/components/TopBar"
import BottomNav from "@/components/BottomNav"
import PosterCard from "@/components/PosterCard"
import { CardShimmer, HeroShimmer } from "@/components/Shimmer"
import { api, TitleItem } from "@/lib/api"
import { getLang, setLang } from "@/lib/storage"
import MotionPage from "@/components/MotionPage"
import ContinueRail from "@/components/ContinueRail"

function useDebounce<T>(value: T, ms = 350) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export default function HomePage() {
  const [lang, _setLang] = useState("en")
  const [items, setItems] = useState<TitleItem[]>([])
  const [loading, setLoading] = useState(true)

  const [q, setQ] = useState("")
  const dq = useDebounce(q, 350)

  const [visibleCount, setVisibleCount] = useState(18)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    _setLang(getLang("en"))
  }, [])

  useEffect(() => {
    setLoading(true)
    setVisibleCount(18)
    const run = async () => {
      try {
        if (dq.trim()) {
          const r = await api.search(dq.trim(), lang)
          setItems(r.data ?? [])
        } else {
          const r = await api.home(lang)
          setItems(r.data ?? [])
        }
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [lang, dq])

  const onLangChange = (l: string) => {
    _setLang(l)
    setLang(l)
  }

  const hero = items[0]
  const visible = useMemo(() => items.slice(0, visibleCount), [items, visibleCount])

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + 18, items.length))
  }, [items.length])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: "900px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [loadMore])

  return (
    <MotionPage>
      <TopBar
        lang={lang}
        onLangChange={onLangChange}
        rightSlot={
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ui-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="w-80 rounded-full ui-panel ui-border pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--border)/0.18)]"
              />
            </div>
          </div>
        }
      />

      <div className="sm:hidden px-4 pt-3">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ui-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-full ui-panel ui-border pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--border)/0.18)]"
          />
        </div>
      </div>

      {/* Hero (tanpa gradient, pakai scrim elegan) */}
      <div className="mt-3">
        {loading ? (
          <HeroShimmer />
        ) : hero ? (
          <div className="relative h-[52vh] w-full ui-border border-l-0 border-r-0">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hero.cover})` }} />
            <div className="absolute inset-0 bg-black/28" />

            <div className="absolute bottom-6 left-4 right-4 max-w-4xl">
              <div className="text-3xl sm:text-4xl font-extrabold leading-tight">
                {hero.name}
              </div>
              <div className="mt-2 ui-muted line-clamp-3 text-sm sm:text-base">
                {hero.tagline ? hero.tagline : hero.summary}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href={`/title/${hero.code}`}
                  className="rounded-full ui-panel ui-border px-5 py-2 ui-panel-hover inline-flex items-center gap-2 font-semibold"
                >
                  <i className="ri-information-line" /> Detail
                </a>
                <a
                  href={`/watch/${hero.code}?ep=1`}
                  className="rounded-full ui-panel ui-border px-5 py-2 ui-panel-hover inline-flex items-center gap-2 font-semibold"
                >
                  <i className="ri-play-fill" /> Tonton
                </a>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(hero.tags ?? []).slice(0, 4).map((t) => (
                  <span key={t} className="text-xs rounded-full ui-panel ui-border px-3 py-1 ui-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-6 pb-28">
        {!dq.trim() && <ContinueRail />}

        <div className="mt-8 flex items-end justify-between gap-3">
          <div>
            <div className="text-xl font-bold">{dq.trim() ? `Hasil “${dq.trim()}”` : "Browse"}</div>
            <div className="text-sm ui-muted">{items.length.toLocaleString()} judul</div>
          </div>
          <div className="text-xs ui-muted">{visible.length}/{items.length}</div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {loading
            ? Array.from({ length: 18 }).map((_, i) => <CardShimmer key={i} />)
            : visible.map((it) => <PosterCard key={it.code} item={it} />)}
        </div>

        <div ref={sentinelRef} className="h-16" />
      </div>

      <BottomNav />
    </MotionPage>
  )
}