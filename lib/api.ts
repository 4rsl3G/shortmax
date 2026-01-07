export type Language = { code: string; name: string; localName: string }

export type TitleItem = {
  id: number
  code: number
  name: string
  cover: string
  episodes: number
  views: number
  favorites: number
  summary: string
  tags: string[]
  tagline: string
}

export type EpisodeItem = { id: number; episode: number; locked: boolean } // locked diabaikan

export type PlayResponse = {
  data: {
    id: number
    name: string
    episode: number
    total: number
    video: { video_480?: string; video_720?: string; video_1080?: string }
    expires: number
    expires_in: number
  }
}

async function jget<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
  return res.json()
}

export const api = {
  languages: () => jget<{ data: Language[] }>(`/api/shortmax/languages`),
  home: (lang: string) => jget<{ data: TitleItem[] }>(`/api/shortmax/home?lang=${encodeURIComponent(lang)}`),
  search: (q: string, lang: string) =>
    jget<{ data: TitleItem[] }>(`/api/shortmax/search?q=${encodeURIComponent(q)}&lang=${encodeURIComponent(lang)}`),
  episodes: (code: number, lang: string) =>
    jget<{ data: EpisodeItem[] }>(`/api/shortmax/episodes/${code}?lang=${encodeURIComponent(lang)}`),
  play: (code: number, lang: string, ep: number) =>
    jget<PlayResponse>(`/api/shortmax/play/${code}?lang=${encodeURIComponent(lang)}&ep=${encodeURIComponent(ep)}`),
}