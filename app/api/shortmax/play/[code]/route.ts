import { NextResponse } from "next/server"
import { shortmaxFetch } from "../../_lib"

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const { searchParams } = new URL(req.url)
  const lang = searchParams.get("lang") ?? "en"
  const ep = searchParams.get("ep") ?? "1"
  const data = await shortmaxFetch(`/play/${params.code}?lang=${encodeURIComponent(lang)}&ep=${encodeURIComponent(ep)}`)
  return NextResponse.json(data)
}