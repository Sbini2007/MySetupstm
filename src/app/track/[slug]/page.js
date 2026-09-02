"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SetupDisplay from "@/components/SetupDisplay";
import { tracks } from "@/lib/data";
import { emptyFlatSetupForSlug } from "@/lib/setup-keys";

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [setup, setSetup] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const premium = Boolean(session?.user?.premium);
  const unlocked = mounted && status === "authenticated" && premium;

  const track = useMemo(() => tracks.find((item) => item.slug === params.slug), [params.slug]);
  const trackIndex = useMemo(() => {
    const i = tracks.findIndex((item) => item.slug === params.slug);
    return i >= 0 ? i + 1 : 0;
  }, [params.slug]);

  const loadSetup = useCallback(async () => {
    if (!params.slug || !unlocked) return;
    setLoadError(null);
    try {
      const res = await fetch(`/api/setups/${params.slug}`, { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          setLoadError("premium");
          setSetup(null);
          return;
        }
        setSetup(emptyFlatSetupForSlug());
        return;
      }
      setSetup(data.setup || emptyFlatSetupForSlug());
    } catch {
      setSetup(emptyFlatSetupForSlug());
    }
  }, [params.slug, unlocked]);

  useEffect(() => {
    loadSetup();
    const timer = setInterval(loadSetup, 30000);
    return () => clearInterval(timer);
  }, [loadSetup]);

  if (!track) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-semibold">Track not found</h1>
          <p className="mt-4 text-white/60">Return to the track list to select another circuit.</p>
          <button
            onClick={() => router.push("/tracks")}
            className="mt-8 inline-flex rounded-full bg-violet-500 px-6 py-3 font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-violet-400"
          >
            Back to tracks
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const headerLabel = `R${String(trackIndex).padStart(2, "0")} ${track.country}`;
  const subtitle = track.circuit;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6 lg:max-w-4xl">
        {!unlocked ? (
          <section className="rounded-[28px] border border-white/10 bg-[#101010]/90 p-8 shadow-[0_0_40px_rgba(124,58,237,0.1)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="grid h-14 w-20 place-items-center rounded-xl border border-white/10 bg-white/5 p-2">
                <Image
                  src={`/flags/${track.flagCode}.svg`}
                  alt={`${track.country} flag`}
                  width={52}
                  height={34}
                  style={{ width: "auto", height: "auto" }}
                  className="h-9 w-14 object-contain"
                />
              </span>
              <div>
                <p className="text-3xl font-black text-white">{headerLabel}</p>
                <p className="mt-1 text-white/50">{subtitle}</p>
              </div>
            </div>
            <div className="mt-10 rounded-2xl border border-violet-400/15 bg-[#111111] p-8 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-violet-300/80">Premium</p>
              <h2 className="mt-4 text-2xl font-bold text-white">Setup Gara / Qualifica / Bagnato</h2>
              <p className="mt-3 text-white/58">Accedi e attiva il premium per vedere tutti i valori aggiornati dall&apos;admin.</p>
              <button
                onClick={() => router.push(session ? "/checkout" : "/login")}
                className="mt-8 inline-flex rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-violet-400"
              >
                {session && !premium ? "Paga con PayPal" : "Accedi"}
              </button>
            </div>
          </section>
        ) : loadError === "premium" ? (
          <section className="rounded-[28px] border border-violet-400/15 bg-[#111111] p-8 text-center">
            <p className="text-violet-200">Premium richiesto per caricare i setup.</p>
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-6 rounded-full bg-violet-500 px-6 py-3 font-bold text-white"
            >
              Checkout
            </button>
          </section>
        ) : setup ? (
          <section className="rounded-[28px] border border-white/10 bg-[#101010]/90 p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
              <span className="grid h-16 w-24 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 p-2">
                <Image
                  src={`/flags/${track.flagCode}.svg`}
                  alt={`${track.country} flag`}
                  width={56}
                  height={36}
                  style={{ width: "auto", height: "auto" }}
                  className="h-10 w-16 object-contain"
                />
              </span>
              <div>
                <p className="text-4xl font-black tracking-tight text-white sm:text-5xl">{headerLabel}</p>
                <p className="mt-2 text-sm text-white/48 sm:text-base">{subtitle}</p>
              </div>
            </div>
            <SetupDisplay setup={setup} onBack={() => router.push("/circuiti")} />
          </section>
        ) : (
          <p className="text-center text-white/50">Caricamento setup…</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
