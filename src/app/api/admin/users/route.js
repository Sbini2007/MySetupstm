import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getServerUsers, setServerUserAdminFlag, setServerUserPremium, setServerUserRole } from "@/lib/server-store";

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

  const { email, premium, admin, role } = body;
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  if (typeof role === "string") {
    setServerUserRole(email, role);
  } else {
    if (typeof premium === "boolean") {
      setServerUserPremium(email, premium);
    }
    if (typeof admin === "boolean") {
      setServerUserAdminFlag(email, admin);
    }
  }

  return NextResponse.json({ users: getServerUsers() });
}

export async function POST(request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  try {
    const { email, name, role, premium, admin } = await request.json();
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const users = upsertServerUser({
      email,
      name: name || email.split("@")[0],
      role: role || "user",
      premium: Boolean(premium),
      admin: Boolean(admin),
      provider: "admin-created",
    });

    return NextResponse.json({ ok: true, users });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Missing email param" }, { status: 400 });
  }

  const { deleteServerUser } = await import("@/lib/server-store");
  deleteServerUser(email);

  return NextResponse.json({ ok: true, users: getServerUsers() });
}
