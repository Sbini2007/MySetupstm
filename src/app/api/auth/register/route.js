import { NextResponse } from "next/server";
import { registerServerUser } from "@/lib/server-store";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body || {};

    if (!email || !String(email).includes("@")) {
      return NextResponse.json({ ok: false, error: "Inserisci un indirizzo email valido." }, { status: 400 });
    }

    if (!password || String(password).length < 4) {
      return NextResponse.json({ ok: false, error: "La password deve contenere almeno 4 caratteri." }, { status: 400 });
    }

    const user = registerServerUser({
      name: name ? String(name).trim() : "",
      email: String(email).trim().toLowerCase(),
      password: String(password),
    });

    return NextResponse.json({
      ok: true,
      message: "Iscrizione completata con successo!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        admin: user.admin,
        premium: user.premium,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message || "Errore durante la registrazione" },
      { status: 400 }
    );
  }
}
