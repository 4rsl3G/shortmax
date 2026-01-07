export type ContinueItem = {
  code: number
  ep: number
  name: string
  cover: string
  updatedAt: number
}

const KEY = "drashort_continue_v1"
const MAX = 24

export function getContinueList(): ContinueItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw) as ContinueItem[]
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function upsertContinue(item: Omit<ContinueItem, "updatedAt">) {
  const list = getContinueList()
  const now = Date.now()
  const next: ContinueItem[] = [
    { ...item, updatedAt: now },
    ...list.filter((x) => x.code !== item.code),
  ].slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function removeContinue(code: number) {
  const list = getContinueList().filter((x) => x.code !== code)
  localStorage.setItem(KEY, JSON.stringify(list))
}