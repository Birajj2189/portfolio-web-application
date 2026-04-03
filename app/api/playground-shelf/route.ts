import { NextResponse } from "next/server"
import { fetchPlaygroundShelf } from "@/lib/playground-shelf"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { data, warnings } = await fetchPlaygroundShelf()
    return NextResponse.json({ data, warnings })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load playground shelf"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
