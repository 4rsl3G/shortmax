import { NextResponse } from "next/server"
import { shortmaxFetch } from "../_lib"

export async function GET() {
  const data = await shortmaxFetch(`/languages?`)
  return NextResponse.json(data)
}