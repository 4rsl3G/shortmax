"use client"

import Link from "next/link"
import LanguagePicker from "./LanguagePicker"
import ThemeToggle from "./ThemeToggle"

export default function TopBar({
  lang,
  onLangChange,
  rightSlot,
}: {
  lang: string
  onLangChange: (l: string) => void
  rightSlot?: React.ReactNode
}) {
  return (
    <div className="sticky top-0 z-40 ui-panel ui-border border-l-0 border-r-0 border-t-0">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <Link href="/" className="font-extrabold tracking-tight text-lg inline-flex items-center gap-2">
          <i className="ri-movie-2-line" />
          DraShort
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {rightSlot}
          <LanguagePicker lang={lang} onChange={onLangChange} />
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}