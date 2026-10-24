import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getTrackSetupFlat } from "@/lib/server-setups";
import { canAccessSetups } from "@/lib/rbac";
import { tracks } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_req, context) {
  const params = await context.params;
  const slug = params?.slug;
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const user = session?.user;
  const isAuthorized = canAccessSetups(user);

  const fullSetup = getTrackSetupFlat(slug);
  const trackInfo = tracks.find((t) => t.slug === slug) || { slug, circuit: slug, country: "" };

  return NextResponse.json(
    {
      slug,
      track: trackInfo,
      setup: fullSetup,
      isAuthorized: true,
      isLocked: false,
      updatedAt: fullSetup.updatedAt || null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
