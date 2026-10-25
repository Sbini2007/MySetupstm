import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import {
  getAllTrackSetups,
  saveTrackSetupFlat,
  duplicateTrackSetup,
  deleteTrackSetup,
  createTrackSetup,
} from "@/lib/server-setups";
import { canManageSetups } from "@/lib/rbac";
import { generateFlatSetup } from "@/lib/default-setups";
import { tracks } from "@/lib/data";

export const dynamic = "force-dynamic";

async function requireEditorOrAdmin() {
  const session = await getServerSession(authOptions);
  if (!canManageSetups(session?.user)) {
    return { error: NextResponse.json({ error: "Accesso negato. Ruolo Admin o Editor richiesto." }, { status: 403 }) };
  }
  return { session };
}

export async function GET() {
  const gate = await requireEditorOrAdmin();
  if (gate.error) return gate.error;
  const defaults = Object.fromEntries(tracks.map((track) => [track.slug, generateFlatSetup(track.slug)]));
  return NextResponse.json(
    { setups: await getAllTrackSetups(), defaults },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(request) {
  const gate = await requireEditorOrAdmin();
  if (gate.error) return gate.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const { slug, setup } = body;
  if (!slug || typeof slug !== "string" || !setup || typeof setup !== "object") {
    return NextResponse.json({ error: "Slug o setup mancanti" }, { status: 400 });
  }

  const saved = await saveTrackSetupFlat(slug, setup);
  return NextResponse.json({ ok: true, slug, setup: saved }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  const gate = await requireEditorOrAdmin();
  if (gate.error) return gate.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const { action, sourceSlug, targetSlug, variantFrom, variantTo, slug, setup } = body;

  if (action === "duplicate" && sourceSlug && targetSlug) {
    const duplicated = await duplicateTrackSetup(sourceSlug, targetSlug, variantFrom, variantTo);
    return NextResponse.json({ ok: true, setup: duplicated, message: "Setup duplicato con successo." });
  }

  if (action === "create" || slug) {
    const target = slug || targetSlug;
    if (!target) return NextResponse.json({ error: "Slug mancante" }, { status: 400 });
    const created = await createTrackSetup(target, setup || {});
    return NextResponse.json({ ok: true, setup: created, message: "Setup creato con successo." });
  }

  return NextResponse.json({ error: "Azione non riconosciuta" }, { status: 400 });
}

export async function DELETE(request) {
  const gate = await requireEditorOrAdmin();
  if (gate.error) return gate.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const { slug } = body;
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Slug mancante per l'eliminazione" }, { status: 400 });
  }

  const deleted = await deleteTrackSetup(slug);
  return NextResponse.json({ ok: deleted, message: deleted ? "Setup ripristinato con successo." : "Pista non trovata." });
}
