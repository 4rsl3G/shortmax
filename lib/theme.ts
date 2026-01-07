const KEY = "drashort_theme" // "dark" | "light"

export function getTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark"
  const v = localStorage.getItem(KEY)
  return v === "light" ? "light" : "dark"
}

export function setTheme(v: "dark" | "light") {
  localStorage.setItem(KEY, v)
  document.documentElement.setAttribute("data-theme", v)
}

export function initTheme() {
  const v = getTheme()
  document.documentElement.setAttribute("data-theme", v)
  return v
}