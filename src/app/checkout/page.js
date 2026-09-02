"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NavBar from "@/components/NavBar";
import { Check, Zap } from "lucide-react";

export default function CheckoutPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const paypalHostRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [configError, setConfigError] = useState(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      setConfigError("Configure NEXT_PUBLIC_PAYPAL_CLIENT_ID and PayPal server credentials in .env.local");
      return;
    }
    if (typeof window === "undefined" || window.paypal) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture`;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => setConfigError("Could not load PayPal SDK");
    document.body.appendChild(script);
  }, [clientId]);

  useEffect(() => {
    if (!sdkReady || typeof window === "undefined" || !window.paypal) return;
    if (status !== "authenticated" || !session?.user?.email) return;
    const el = paypalHostRef.current;
    if (!el) return;

    el.innerHTML = "";
    const buttons = window.paypal.Buttons({
      style: { layout: "vertical", shape: "rect", label: "pay" },
      createOrder: async () => {
        const res = await fetch("/api/paypal/create-order", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Create order failed");
        return data.id;
      },
      onApprove: async (data) => {
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID }),
        });
        const out = await res.json();
        if (!res.ok) throw new Error(out.error || "Capture failed");
        await update();
        router.push("/setups");
      },
    });
    buttons.render(el);
    return () => {
      try {
        buttons.close();
      } catch {
        /* ignore */
      }
    };
  }, [sdkReady, status, session?.user?.email, update, router]);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="relative mx-auto max-w-lg px-4 pb-24 pt-28">
        <p className="text-center text-sm font-bold uppercase tracking-[0.35em] text-violet-300">Checkout</p>
        <h1 className="mt-4 text-center text-4xl font-black">Premium access</h1>
        <p className="mt-3 text-center text-white/55">
          One-time payment via PayPal. Your purchase is linked to <span className="text-white/85">{status === "authenticated" ? session.user.email : "your account"}</span>.
        </p>

        <div className="mt-10 rounded-2xl border border-violet-500/25 bg-white/4 p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/45">Total</p>
              <p className="mt-1 text-4xl font-black text-violet-400">EUR 15</p>
            </div>
            <Zap className="text-violet-400/50" size={36} />
          </div>
          <ul className="mt-6 space-y-2 text-sm text-white/75">
            {["Full setup library", "Premium guides & notes", "Discord support"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/20 text-violet-200">
                  <Check size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {status === "loading" ? (
          <p className="mt-10 text-center text-white/50">Loading session…</p>
        ) : status === "unauthenticated" ? (
          <div className="mt-10 space-y-4 text-center">
            <p className="text-white/60">Sign in with Google or Discord before paying so we can unlock the correct account.</p>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/checkout" })}
              className="w-full rounded-xl bg-white px-6 py-3.5 text-sm font-black text-gray-900 transition hover:bg-white/90"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => signIn("discord", { callbackUrl: "/checkout" })}
              className="w-full rounded-xl border border-white/15 bg-[#5865F2] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#4752c4]"
            >
              Continue with Discord
            </button>
            <Link href="/login" className="inline-block text-sm text-violet-300 hover:text-violet-200">
              Other sign-in options
            </Link>
          </div>
        ) : configError ? (
          <p className="mt-10 text-center text-sm text-amber-200/90">{configError}</p>
        ) : (
          <div className="mt-10">
            <p className="mb-4 text-center text-sm text-white/50">Pay with PayPal</p>
            <div ref={paypalHostRef} className="flex min-h-[140px] justify-center" />
          </div>
        )}

        <p className="mt-10 text-center text-xs text-white/35">
          After payment, your session refreshes automatically. If premium does not unlock, refresh the page once.
        </p>
      </main>
    </div>
  );
}
