"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SetupDisplay from "@/components/SetupDisplay";
import { tracks } from "@/lib/data";
import { safeFetchJson } from "@/lib/safe-json";

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();

  const track = useMemo(() => tracks.find((item) => item.slug === params.slug) || tracks[0], [params.slug]);
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

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col justify-between">
      <div>
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
          <section>
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
