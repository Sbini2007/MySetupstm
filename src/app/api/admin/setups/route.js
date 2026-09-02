import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getAllTrackSetups, saveTrackSetupFlat } from "@/lib/server-setups";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!session.user.admin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { session };
}

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  return NextResponse.json({ setups: getAllTrackSetups() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, setup } = body;
  if (!slug || typeof slug !== "string" || !setup || typeof setup !== "object") {
    return NextResponse.json({ error: "Missing slug or setup" }, { status: 400 });
  }

  const saved = saveTrackSetupFlat(slug, setup);
  return NextResponse.json({ ok: true, slug, setup: saved }, { headers: { "Cache-Control": "no-store" } });
}
