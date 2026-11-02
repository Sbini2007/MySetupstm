import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getServerGuides, saveServerGuides } from "@/lib/server-store";
import { normalizeGuides } from "@/lib/guides";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!session.user.admin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  return NextResponse.json(
    { guides: await getServerGuides() },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(body?.guides) || body.guides.length > 100) {
    return NextResponse.json({ error: "Guide list is invalid." }, { status: 400 });
  }

  for (const guide of body.guides) {
    if (
      !guide ||
      typeof guide.title !== "string" ||
      !guide.title.trim() ||
      guide.title.trim().length > 120 ||
      typeof guide.description !== "string" ||
      guide.description.trim().length > 500 ||
      (guide.content !== undefined && (typeof guide.content !== "string" || guide.content.length > 30000))
    ) {
      return NextResponse.json({ error: "Guide fields are invalid or too long." }, { status: 400 });
    }
  }

  const normalizedGuides = normalizeGuides(body.guides);
  if (normalizedGuides.length !== body.guides.length) {
    return NextResponse.json({ error: "Every guide must have a valid title." }, { status: 400 });
  }
  const slugs = normalizedGuides.map((guide) => guide.slug);
  if (new Set(slugs).size !== slugs.length) {
    return NextResponse.json({ error: "Guide titles must be unique." }, { status: 400 });
  }

  return NextResponse.json(
    { guides: await saveServerGuides(normalizedGuides) },
    { headers: { "Cache-Control": "no-store" } }
  );
}
