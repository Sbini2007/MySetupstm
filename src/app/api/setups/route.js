import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { canAccessSetups } from "@/lib/rbac";
import { getAllTrackSetups } from "@/lib/server-setups";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!canAccessSetups(session?.user)) {
    return NextResponse.json(
      { isAuthorized: false, setups: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const setups = getAllTrackSetups();
  return NextResponse.json({
    isAuthorized: true,
    setups,
  }, { headers: { "Cache-Control": "no-store" } });
}
