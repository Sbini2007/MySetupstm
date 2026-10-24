import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { canManageSetups } from "@/lib/rbac";
import { getAllTrackSetups } from "@/lib/server-setups";
import { tracks } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!canManageSetups(session?.user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const setups = getAllTrackSetups();
  return NextResponse.json({
    ok: true,
    tracks,
    setups,
  });
}
