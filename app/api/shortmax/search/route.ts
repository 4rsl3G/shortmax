import { NextResponse } from "next/server"
import { shortmaxFetch } from "../_lib"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? ""
  const lang = searchParams.get("lang") ?? "en"
  const data = await shortmaxFetch(`/search?q=${encodeURIComponent(q)}&lang=${encodeURIComponent(lang)}`)
  return NextResponse.json(data)
}