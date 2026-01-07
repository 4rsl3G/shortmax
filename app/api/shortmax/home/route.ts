import { NextResponse } from "next/server"
import { shortmaxFetch } from "../_lib"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lang = searchParams.get("lang") ?? "en"
  const data = await shortmaxFetch(`/home?lang=${encodeURIComponent(lang)}`)
  return NextResponse.json(data)
}