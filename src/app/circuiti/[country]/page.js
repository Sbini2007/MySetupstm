"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AuthGate from "@/components/AuthGate";
import SetupDisplay from "@/components/SetupDisplay";
import { tracks } from "@/lib/data";
import { emptyFlatSetupForSlug } from "@/lib/setup-keys";

export default function CircuitDetailPage() {
  const params = useParams();
  const { data: session, status } = useSession();
  const slug = params.country || params.slug;
  const track = tracks.find((item) => item.slug === slug) || tracks[0];
  const trackIndex = tracks.findIndex((item) => item.slug === track.slug) + 1;
  const [setup, setSetup] = useState(null);

  const premium = Boolean(session?.user?.premium || session?.user?.admin);
  const unlocked = status === "authenticated" && premium;

  const loadSetup = useCallback(async () => {
    if (!slug || !unlocked) return;

    try {
      const res = await fetch(`/api/setups/${slug}`, { credentials: "include", cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        setSetup(emptyFlatSetupForSlug());
        return;
      }

      setSetup(data.setup || emptyFlatSetupForSlug());
    } catch {
      setSetup(emptyFlatSetupForSlug());
    }
  }, [slug, unlocked]);

  useEffect(() => {
    loadSetup();
    const timer = setInterval(loadSetup, 30000);
    return () => clearInterval(timer);
  }, [loadSetup]);

  return (
    <div className="min-h-screen bg-[#07090d] text-white">
      <NavBar />
      <AuthGate requirePremium>
        <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="mt-7 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-20 place-items-center rounded-xl border border-white/10 bg-white/5 p-2">
                <Image src={`/flags/${track.flagCode}.svg`} alt="" width={56} height={36} style={{ width: "auto", height: "auto" }} className="h-9 w-14 object-contain" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-violet-200/70">
                  R{String(trackIndex).padStart(2, "0")} · {track.country}
                </p>
                <h1 className="mt-2 text-5xl font-black tracking-tight text-white">{track.country}</h1>
                <p className="mt-1 text-base text-white/55">{track.circuit}</p>
              </div>
            </div>

            <span className="inline-flex items-center rounded-lg border border-violet-400/35 bg-violet-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-violet-200">
              Premium
            </span>
          </div>

          {setup ? (
            <section className="mt-8">
              <SetupDisplay setup={setup} onBack={() => window.history.back()} />
            </section>
          ) : (
            <p className="mt-8 text-center text-white/50">Caricamento setup…</p>
          )}
        </main>
      </AuthGate>
      <Footer />
    </div>
  );
}
