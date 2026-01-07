"use client"

import { useEffect, useState } from "react"
import { api, Language } from "@/lib/api"

export default function LanguagePicker({ lang, onChange }: { lang: string; onChange: (l: string) => void }) {
  const [items, setItems] = useState<Language[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    api.languages().then((r) => setItems(r.data)).catch(() => setItems([]))
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full ui-panel ui-border px-3 py-2 text-sm ui-panel-hover inline-flex items-center gap-2"
      >
        <i className="ri-translate-2" />
        {lang.toUpperCase()}
        <i className="ri-arrow-down-s-line" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl ui-panel ui-border ui-shadow overflow-hidden">
          <div className="px-3 py-2 text-xs ui-muted border-b border-[rgb(var(--border)/0.10)]">
            Pilih bahasa
          </div>
          <div className="max-h-80 overflow-auto">
            {items.map((it) => (
              <button
                key={it.code}
                onClick={() => {
                  onChange(it.code)
                  setOpen(false)
                }}
                className="w-full text-left px-3 py-2 ui-panel-hover flex items-center justify-between"
              >
                <div>
                  <div className="text-sm">{it.localName}</div>
                  <div className="text-xs ui-muted">{it.name}</div>
                </div>
                <div className="text-xs ui-muted">{it.code}</div>
              </button>
            ))}
            {items.length === 0 && (
              <div className="px-3 py-3 text-sm ui-muted">Gagal load bahasa</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}