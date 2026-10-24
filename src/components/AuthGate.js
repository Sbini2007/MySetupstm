"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/client-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";

/**
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * @param {boolean} [props.requirePremium] - if true, user must have premium or admin access
 */
export default function AuthGate({ children, requirePremium = false }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    setReady(true);
  }, [status]);

  useEffect(() => {
    if (!ready || status !== "unauthenticated") return;
    router.replace("/login");
  }, [ready, status, router]);

  if (!ready || status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-20 text-white">
        <div className="max-w-md rounded-3xl border border-white/10 bg-[#0c0d16] p-10 text-center shadow-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-violet-400">Verifica Sessione</span>
          <p className="mt-3 text-sm text-white/50">Caricamento autorizzazioni pilota…</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (requirePremium && !session?.user?.premium && !session?.user?.admin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-20 text-white">
        <div className="max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-[#10111a] to-[#07070c] p-8 text-center shadow-2xl sm:p-10">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] text-zinc-200 border border-white/10">
            <Lock size={24} />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <span>Accesso Pro Richiesto</span>
          </div>

          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
            SBLOCCA TUTTI I SETUP
          </h2>

          <p className="mt-3 text-xs leading-relaxed text-zinc-400">
            Questa sezione include telemetrie avanzate, valori di assetto per qualifica e gara e note di pista per i 24 circuiti mondiali.
          </p>

          <div className="mt-8">
            <Link
              href="/checkout"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-zinc-200 hover:-translate-y-0.5"
            >
              <Sparkles size={15} />
              Sblocca con PayPal (15€)
              <ArrowRight size={15} />
            </Link>
          </div>

          <p className="mt-4 text-[10px] font-mono text-white/40">
            Pagamento unico senza rinnovo. Attivazione automatica istantanea.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
