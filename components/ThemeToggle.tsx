"use client"

import { useEffect, useState } from "react"
import { getTheme, initTheme, setTheme } from "@/lib/theme"

export default function ThemeToggle() {
  const [theme, setT] = useState<"dark" | "light">("dark")

  useEffect(() => {
    setT(initTheme())
  }, [])

  return (
    <button
      onClick={() => {
        const next = (theme === "dark" ? "light" : "dark") as const
        setT(next)
        setTheme(next)
      }}
      className="rounded-full ui-panel ui-border px-3 py-2 text-sm ui-panel-hover inline-flex items-center gap-2"
      title="Toggle theme"
    >
      <i className={theme === "dark" ? "ri-moon-line" : "ri-sun-line"} />
      <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  )
}