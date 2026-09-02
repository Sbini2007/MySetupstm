import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { createTicket, getTicketsAll } from "@/lib/server-tickets";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.premium && !session.user.admin) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }
  const all = getTicketsAll();
  if (session.user.admin) {
    return NextResponse.json({ tickets: all });
  }
  const email = session.user.email.toLowerCase();
  return NextResponse.json({ tickets: all.filter((t) => String(t.email || "").toLowerCase() === email) });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.premium && !session.user.admin) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();
  if (!subject || !message) {
    return NextResponse.json({ error: "Subject and message required" }, { status: 400 });
  }

  const ticket = createTicket({
    email: session.user.email,
    subject,
    message,
  });
  return NextResponse.json({ ticket });
}
