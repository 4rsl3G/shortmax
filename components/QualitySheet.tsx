"use client"

import { motion } from "framer-motion"

export type QualityKey = "auto" | "480" | "720" | "1080"

export default function QualitySheet({
  open,
  onClose,
  current,
  available,
  onPick,
}: {
  open: boolean
  onClose: () => void
  current: QualityKey
  available: { q: QualityKey; label: string; url?: string }[]
  onPick: (q: QualityKey) => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80]">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.22 }}
        className="absolute left-0 right-0 bottom-0 mx-auto max-w-lg ui-panel ui-border rounded-t-3xl p-4"
      >
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold inline-flex items-center gap-2">
            <i className="ri-hd-line" /> Quality
          </div>
          <button onClick={onClose} className="rounded-full ui-panel ui-border p-2 ui-panel-hover">
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="mt-3 grid gap-2">
          {available.map((it) => (
            <button
              key={it.q}
              disabled={!it.url && it.q !== "auto"}
              onClick={() => onPick(it.q)}
              className={[
                "w-full rounded-2xl px-4 py-3 text-left ui-border ui-panel-hover",
                it.q === current ? "ring-2 ring-[rgb(var(--border)/0.18)]" : "",
                (!it.url && it.q !== "auto") ? "opacity-40 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{it.label}</div>
                {it.q === current && <i className="ri-check-line" />}
              </div>
              <div className="text-xs ui-muted mt-1">
                {it.q === "auto" ? "Pilih default (720 jika ada)" : (it.url ? "Tersedia" : "Tidak tersedia")}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}