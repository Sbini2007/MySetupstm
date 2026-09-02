import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { addTicketReply, getTicketById } from "@/lib/server-tickets";

export async function POST(request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.premium && !session.user.admin) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  const params = await context.params;
  const id = params?.id;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const ticket = getTicketById(id);
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = String(body.body || "").trim();
  if (!text) return NextResponse.json({ error: "Empty reply" }, { status: 400 });

  const email = session.user.email.toLowerCase();
  const owner = String(ticket.email || "").toLowerCase() === email;

  if (session.user.admin) {
    const next = addTicketReply(id, { author: "admin", body: text });
    return NextResponse.json({ ticket: next });
  }

  if (owner) {
    const next = addTicketReply(id, { author: "user", body: text });
    return NextResponse.json({ ticket: next });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
