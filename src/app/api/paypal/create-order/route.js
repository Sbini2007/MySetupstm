import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { createPayPalOrder } from "@/lib/paypal";

const AMOUNT = process.env.PAYPAL_AMOUNT || "15.00";
const CURRENCY = process.env.PAYPAL_CURRENCY || "EUR";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const order = await createPayPalOrder(session.user.email, AMOUNT, CURRENCY);
    return NextResponse.json({ id: order.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message || "PayPal error" }, { status: 500 });
  }
}
