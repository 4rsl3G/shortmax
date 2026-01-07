import "server-only"

const BASE_URL = process.env.SHORTMAX_BASE_URL!
const TOKEN = process.env.SHORTMAX_TOKEN!

export async function shortmaxFetch(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Shortmax API error ${res.status}: ${text}`)
  }
  return res.json()
}