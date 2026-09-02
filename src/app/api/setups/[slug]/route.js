import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getTrackSetupFlat } from "@/lib/server-setups";

export const dynamic = "force-dynamic";

export async function GET(_req, context) {
  const params = await context.params;
  const slug = params?.slug;
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized", locked: true }, { status: 401 });
  }

  const allowed = Boolean(session.user.premium || session.user.admin);
  if (!allowed) {
    return NextResponse.json({ error: "Premium required", locked: true }, { status: 403 });
  }

  const setup = getTrackSetupFlat(slug);
  return NextResponse.json({ slug, setup, updatedAt: setup.updatedAt || null }, { headers: { "Cache-Control": "no-store" } });
}
