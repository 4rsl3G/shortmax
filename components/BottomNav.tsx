"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

function Item({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl",
        active ? "ui-panel ui-border" : "opacity-80 hover:opacity-100",
      ].join(" ")}
    >
      <i className={`${icon} text-xl`} />
      <span className="text-[11px]">{label}</span>
    </Link>
  )
}

export default function BottomNav() {
  const path = usePathname()
  // nav simpel (Home + Search fokus di home, Continue via Home, Profile placeholder)
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="ui-panel ui-border ui-shadow rounded-3xl px-2 py-2 flex items-center justify-around">
          <Item href="/" icon="ri-home-5-line" label="Home" active={path === "/"} />
          <Item href="/?focus=search" icon="ri-search-line" label="Search" active={path === "/search"} />
          <Item href="/?focus=continue" icon="ri-play-circle-line" label="Continue" active={false} />
          <Item href="/?focus=me" icon="ri-user-3-line" label="Me" active={false} />
        </div>
      </div>
    </div>
  )
}