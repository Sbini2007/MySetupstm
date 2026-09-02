import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getServerUsers, setServerUserAdminFlag, setServerUserPremium } from "@/lib/server-store";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!session.user.admin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { session };
}

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  return NextResponse.json({ users: getServerUsers() });
}

export async function PATCH(request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { email, premium, admin } = body;
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  if (typeof premium === "boolean") {
    setServerUserPremium(email, premium);
  }
  if (typeof admin === "boolean") {
    setServerUserAdminFlag(email, admin);
  }

  return NextResponse.json({ users: getServerUsers() });
}
