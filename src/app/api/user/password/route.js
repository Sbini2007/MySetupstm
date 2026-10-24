import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { verifyPassword } from "@/lib/passwords";
import { getServerUserByEmail, setServerUserPassword } from "@/lib/server-store";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Devi accedere per impostare la password." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const { currentPassword, newPassword } = body || {};
  if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 128) {
    return NextResponse.json(
      { error: "La nuova password deve contenere da 8 a 128 caratteri." },
      { status: 400 }
    );
  }

  const user = getServerUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Account non trovato." }, { status: 404 });
  }

  if (user.password) {
    const verification = await verifyPassword(currentPassword, user.password);
    if (!verification.valid) {
      return NextResponse.json({ error: "La password attuale non è corretta." }, { status: 403 });
    }
  }

  const updated = await setServerUserPassword(email, newPassword);
  if (!updated) {
    return NextResponse.json({ error: "Impossibile aggiornare la password." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
