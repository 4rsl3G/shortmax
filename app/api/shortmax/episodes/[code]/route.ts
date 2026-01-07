import { NextResponse } from "next/server"
import { shortmaxFetch } from "../../_lib"

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const { searchParams } = new URL(req.url)
  const lang = searchParams.get("lang") ?? "en"
  const data = await shortmaxFetch(`/episodes/${params.code}?lang=${encodeURIComponent(lang)}`)
  return NextResponse.json(data)
}