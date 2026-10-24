import { NextResponse } from "next/server";
import { getAllTrackSetups } from "@/lib/server-setups";
import { tracks } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const setups = getAllTrackSetups();
  return NextResponse.json({
    ok: true,
    tracks,
    setups,
  });
}
