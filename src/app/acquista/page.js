"use client";

import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, ArrowUpRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const passFeatures = [
  "Tutti i 24 circuiti ufficiali del campionato F1 26",
  "6 configurazioni per pista: Gara, Qualifica, Bagnato, Asciutto, High Downforce, Low Drag",
  "Aggiornamenti inclusi per tutta la stagione F1 26",
  "Bilanciato per basi Direct Drive, volanti a cinghia e gamepad",
  "Accesso immediato con copia negli appunti in 1-click",
  "Ruolo VIP / Pro sul server Discord per supporto e canali dedicati",
];

export default function AcquistaPage() {
  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100">
      <NavBar />

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-16 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
            Pass Stagionale
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Accesso Completo alla Libreria
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-xs sm:text-sm text-zinc-400">
            Un unico pagamento una tantum per sbloccare tutti gli assetti della stagione F1. Nessun abbonamento ricorrente.
          </p>
        </div>

        {/* Pricing Box */}
        <div className="mt-12 mx-auto max-w-lg rounded-2xl border border-white/15 bg-[#0c0c12] p-8 shadow-2xl">
          <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Pass Pro Lifetime</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Stagione F1 26 Completa</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-extrabold text-white">15€</span>
              <span className="block text-[10px] text-zinc-500 uppercase">una tantum</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {passFeatures.map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-xs text-zinc-300">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white">
                  <Check size={11} />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-white/[0.06] pt-6">
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-xs font-semibold text-black transition hover:bg-zinc-200"
            >
              <span>Procedi al Pagamento con PayPal</span>
              <ArrowRight size={14} />
            </Link>
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Transazione sicura PayPal · Attivazione istantanea</span>
            </div>
          </div>
        </div>

        {/* Community Link */}
        <div className="mt-8 text-center">
          <a
            href="https://discord.gg/YzVN3ncCwR"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition"
          >
            <span>Hai dubbi prima di sbloccare? Chiedi nel Discord</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
