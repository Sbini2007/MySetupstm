import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { capturePayPalOrder, getCustomIdFromCaptureResponse } from "@/lib/paypal";
import { setServerUserPremium } from "@/lib/server-store";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const orderID = body.orderID;
  if (!orderID || typeof orderID !== "string") {
    return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
  }

  try {
    const captured = await capturePayPalOrder(orderID);
    const ownerEmail = getCustomIdFromCaptureResponse(captured);
    const sessionEmail = session.user.email.toLowerCase();
    if (!ownerEmail || ownerEmail.toLowerCase() !== sessionEmail) {
      console.error("PayPal custom_id mismatch", { ownerEmail, sessionEmail });
      return NextResponse.json({ error: "Order does not belong to this account" }, { status: 403 });
    }

    setServerUserPremium(session.user.email, true);

    return NextResponse.json({ ok: true, status: captured.status });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Capture failed" }, { status: 500 });
  }
}
