import { NextResponse } from "next/server";
import { getLatestTrackUpdate } from "@/lib/server-setups";

export const dynamic = "force-dynamic";

export async function GET() {
  const track = getLatestTrackUpdate();
  return NextResponse.json({ track }, { headers: { "Cache-Control": "no-store" } });
}
