"use client";

import { useSession, signIn } from "@/lib/client-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Check, ShieldCheck, Lock } from "lucide-react";

export default function CheckoutPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const paypalHostRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [configError, setConfigError] = useState(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      setConfigError("PayPal SDK in modalità sandbox per sviluppo. Configura NEXT_PUBLIC_PAYPAL_CLIENT_ID per completare l'ordine reale.");
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
    script.onerror = () => setConfigError("Impossibile caricare il componente PayPal.");
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
        if (!res.ok) throw new Error(data.error || "Creazione ordine non riuscita");
        return data.id;
      },
      onApprove: async (data) => {
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID }),
        });
        const out = await res.json();
        if (!res.ok) throw new Error(out.error || "Transazione non riuscita");
        await update();
        router.push("/circuiti");
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
    <div className="min-h-screen bg-[#07070a] text-zinc-100">
      <NavBar />
      <main className="mx-auto max-w-lg px-4 pb-24 pt-16 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
            Cassa
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Sblocca MySetups Pro
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Pagamento unico di 15€ associato al tuo profilo per sbloccare tutti i 24 circuiti.
          </p>
        </div>

        {/* Order Summary Box */}
        <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#0c0c10] p-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Season Pass 2026</h3>
              <p className="text-[11px] text-zinc-500">24 Circuiti F1</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">15€</span>
              <span className="block text-[10px] text-zinc-500 uppercase">una tantum</span>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-xs text-zinc-400">
            {[
              "Accesso completo a tutti i 24 circuiti F1",
              "Varianti Gara, Qualifica e Wet per ciascuna pista",
              "Guide tecniche ed esportazione assetto immediata",
              "Ruolo Pro sul server Discord",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check size={12} className="text-emerald-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Auth or Payment Action */}
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#0c0c10] p-6">
          {status === "loading" ? (
            <p className="py-4 text-center text-xs text-zinc-500">Verifica account...</p>
          ) : status === "unauthenticated" ? (
            <div className="space-y-3 text-center">
              <p className="text-xs text-zinc-400">
                Accedi per associare la licenza al tuo profilo prima di procedere:
              </p>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/checkout" })}
                className="w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
              >
                Accedi con Google
              </button>
              <button
                type="button"
                onClick={() => signIn("discord", { callbackUrl: "/checkout" })}
                className="w-full rounded-lg bg-[#5865F2] py-2.5 text-xs font-semibold text-white transition hover:bg-[#4752c4]"
              >
                Accedi con Discord
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
                <span className="text-zinc-500">Account collegato:</span>
                <span className="font-medium text-zinc-200 truncate max-w-[200px]">{session?.user?.email}</span>
              </div>

              {configError ? (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center text-xs text-amber-200">
                  {configError}
                </div>
              ) : (
                <div>
                  <p className="mb-3 text-center text-xs text-zinc-500">Paga con PayPal</p>
                  <div ref={paypalHostRef} className="flex min-h-[100px] justify-center" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 text-center">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>Pagamento sicuro protetto da crittografia</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
