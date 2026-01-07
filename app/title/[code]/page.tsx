"use client"

import { useEffect, useMemo, useState } from "react"
import TopBar from "@/components/TopBar"
import BottomNav from "@/components/BottomNav"
import MotionPage from "@/components/MotionPage"
import { api, EpisodeItem, TitleItem } from "@/lib/api"
import { getLang, setLang } from "@/lib/storage"
import Link from "next/link"

export default function TitleDetailPage({ params }: { params: { code: string } }) {
  const code = Number(params.code)
  const [lang, _setLang] = useState("en")
  const [homeItems, setHomeItems] = useState<TitleItem[] | null>(null)
  const [episodes, setEpisodes] = useState<EpisodeItem[] | null>(null)

  useEffect(() => {
    _setLang(getLang("en"))
  }, [])

  useEffect(() => {
    const run = async () => {
      const h = await api.home(lang)
      setHomeItems(h.data ?? [])
      const e = await api.episodes(code, lang)
      setEpisodes(e.data ?? [])
    }
    run().catch(() => {
      setHomeItems([])
      setEpisodes([])
    })
  }, [code, lang])

  const item = useMemo(() => homeItems?.find((x) => x.code === code), [homeItems, code])

  const onLangChange = (l: string) => {
    _setLang(l)
    setLang(l)
  }

  return (
    <MotionPage>
      <TopBar
        lang={lang}
        onLangChange={onLangChange}
        rightSlot={
          <Link href="/" className="rounded-full ui-panel ui-border px-4 py-2 text-sm ui-panel-hover inline-flex items-center gap-2">
            <i className="ri-arrow-left-line" /> Back
          </Link>
        }
      />

      <div className="relative h-[50vh] ui-border border-l-0 border-r-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item?.cover ?? ""})` }} />
        <div className="absolute inset-0 bg-black/28" />

        <div className="absolute bottom-6 left-4 right-4 max-w-4xl">
          <div className="text-3xl sm:text-4xl font-extrabold">{item?.name ?? "Loading..."}</div>
          <div className="mt-2 ui-muted text-sm sm:text-base line-clamp-4">{item?.summary ?? ""}</div>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href={`/watch/${code}?ep=1`}
              className="rounded-full ui-panel ui-border px-5 py-2 ui-panel-hover inline-flex items-center gap-2 font-semibold"
            >
              <i className="ri-play-fill" /> Tonton
            </Link>
            <button className="rounded-full ui-panel ui-border px-5 py-2 ui-panel-hover inline-flex items-center gap-2 font-semibold">
              <i className="ri-heart-3-line" /> Favorit
            </button>
            <button className="rounded-full ui-panel ui-border px-4 py-2 ui-panel-hover inline-flex items-center gap-2">
              <i className="ri-share-forward-line" /> Share
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(item?.tags ?? []).slice(0, 6).map((t) => (
              <span key={t} className="text-xs rounded-full ui-panel ui-border px-3 py-1 ui-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-6 pb-28">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xl font-bold">Episodes</div>
            <div className="text-sm ui-muted">Total: {episodes?.length ?? "…"}</div>
          </div>
          <div className="text-xs ui-muted">locked diabaikan</div>
        </div>

        <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {(episodes ?? Array.from({ length: 20 }).map((_, i) => ({ id: i, episode: i + 1, locked: false } as any)))
            .map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/${code}?ep=${ep.episode}`}
                className="rounded-2xl ui-panel ui-border px-3 py-2 text-center ui-panel-hover"
              >
                <div className="text-sm font-semibold">{ep.episode}</div>
                <div className="text-[10px] ui-muted inline-flex items-center gap-1 justify-center mt-0.5">
                  <i className="ri-play-circle-line" /> Play
                </div>
              </Link>
            ))}
        </div>
      </div>

      <BottomNav />
    </MotionPage>
  )
}