"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SetupDisplay from "@/components/SetupDisplay";
import { tracks } from "@/lib/data";
import { safeFetchJson } from "@/lib/safe-json";

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();

  const track = useMemo(() => tracks.find((item) => item.slug === params.slug) || tracks[0], [params.slug]);
  const trackIndex = useMemo(() => {
    const i = tracks.findIndex((item) => item.slug === params.slug);
    return i >= 0 ? i + 1 : 1;
  }, [params.slug]);
  const [setup, setSetup] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);

  const loadSetup = useCallback(async () => {
    if (!params.slug) return;
    const data = await safeFetchJson(`/api/setups/${params.slug}`, { cache: "no-store" });
    if (data) {
      setIsAuthorized(data.isAuthorized);
      setSetup(data.isAuthorized ? data.setup : null);
    }
  }, [params.slug]);

  useEffect(() => {
    loadSetup();
  }, [loadSetup]);

  if (!track) {
    return (
      <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col justify-between">
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-2xl font-bold">Circuito non trovato</h1>
          <p className="mt-2 text-xs text-zinc-400">Ritorna alla lista dei setup per selezionare un tracciato.</p>
          <button
            onClick={() => router.push("/setups")}
            className="mt-6 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
          >
            Tutti i setup
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const headerLabel = `Round ${String(trackIndex).padStart(2, "0")} · ${track.country.toUpperCase()}`;
  const subtitle = track.circuit;

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col justify-between">
      <div>
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/setups"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft size={14} />
              <span>Lista Setup</span>
            </Link>

            <span className="rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] font-bold text-zinc-300">
              F1 26 SPEC
            </span>
          </div>

          <section className="space-y-6">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d14] p-6 sm:p-8 relative overflow-hidden">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-20 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-black/40 p-2">
                    <Image
                      src={`/flags/${track.flagCode}.svg`}
                      alt=""
                      width={48}
                      height={32}
                      className="h-8 w-12 rounded-[2px] object-cover ring-1 ring-white/10"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                      <span className="text-zinc-300 font-bold">{headerLabel}</span>
                      <span>·</span>
                      <span className="text-zinc-400">F1 2026</span>
                    </div>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {subtitle}
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">{track.type}</p>
                  </div>
                </div>

              </div>
            </div>

            <SetupDisplay
              setup={setup}
              isAuthorized={isAuthorized}
              onBack={() => router.push("/setups")}
              trackName={track.circuit}
              slug={track.slug}
              track={track}
            />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
