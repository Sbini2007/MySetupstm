import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { canAccessGuides } from "@/lib/rbac";
import { getServerGuides } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canAccessGuides(session.user)) {
    return NextResponse.json({ error: "Guide access is not enabled for this account." }, { status: 403 });
  }

  return NextResponse.json(
    { guides: await getServerGuides() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
