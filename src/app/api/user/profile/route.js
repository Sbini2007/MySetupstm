import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getServerUserByEmail, updateServerUserProfile } from "@/lib/server-store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const row = getServerUserByEmail(session.user.email);
  if (!row) {
    return NextResponse.json({
      email: session.user.email,
      name: session.user.name,
      image: session.user.image || "",
    });
  }
  return NextResponse.json({
    email: row.email,
    name: row.name || row.oauthName || session.user.name,
    image: row.image && String(row.image).trim() ? row.image : "",
    oauthFallback: Boolean(row.oauthImage || row.image),
  });
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name : undefined;
  const image = body.image !== undefined ? body.image : undefined;

  const result = updateServerUserProfile(session.user.email, { name, image });
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Update failed" }, { status: 400 });
  }

  const row = getServerUserByEmail(session.user.email);
  return NextResponse.json({
    ok: true,
    name: row?.name,
    image: row?.image && String(row.image).trim() ? row.image : "",
  });
}
