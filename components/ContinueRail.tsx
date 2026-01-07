"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import ShimmerImage from "./ShimmerImage"
import { ContinueItem, getContinueList, removeContinue } from "@/lib/continue"
import { useEffect, useState } from "react"

export default function ContinueRail() {
  const [items, setItems] = useState<ContinueItem[]>([])

  useEffect(() => {
    setItems(getContinueList())
  }, [])

  if (items.length === 0) return null

  return (
    <div className="mt-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xl font-bold">Continue Watching</div>
          <div className="text-sm ui-muted">Lanjutkan episode terakhir</div>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <div className="flex gap-3 w-max pr-4">
          {items.map((it) => (
            <motion.div
              key={it.code}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="w-[160px]"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl ui-panel ui-border">
                <Link href={`/watch/${it.code}?ep=${it.ep}`}>
                  <div className="absolute inset-0">
                    <ShimmerImage src={it.cover} alt={it.name} fill sizes="160px" className="object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-sm font-semibold line-clamp-2">{it.name}</div>
                    <div className="text-[11px] ui-muted mt-0.5 inline-flex items-center gap-1">
                      <i className="ri-play-circle-line" /> Episode {it.ep}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    removeContinue(it.code)
                    setItems(getContinueList())
                  }}
                  className="absolute top-2 left-2 rounded-full ui-panel ui-border p-2 ui-panel-hover"
                  title="Hapus"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}