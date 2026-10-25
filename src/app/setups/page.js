"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SetupDisplay from "@/components/SetupDisplay";
import AnimatedList from "@/components/AnimatedList";
import { tracks } from "@/lib/data";
import { safeFetchJson } from "@/lib/safe-json";

export default function SetupsPage() {
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("italy-monza");
  const [setupsBySlug, setSetupsBySlug] = useState({});
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [setupError, setSetupError] = useState(false);
  const setupRequestId = useRef(0);

  const fetchSetups = useCallback(async () => {
    const requestId = ++setupRequestId.current;
    setSetupError(false);
    const data = await safeFetchJson("/api/setups", { cache: "no-store" });
    if (requestId !== setupRequestId.current) return;
    if (!data) {
      setSetupError(true);
      return;
    }
    setIsAuthorized(Boolean(data.isAuthorized));
    setSetupsBySlug(data.isAuthorized ? data.setups || {} : {});
  }, []);

  // Load authorized setups once so selecting a circuit only changes local state.
  useEffect(() => {
    fetchSetups();

    const onUpdate = () => fetchSetups();
    const onStorage = (e) => {
      if (e.key === "mysetups_last_updated") fetchSetups();
    };
    window.addEventListener("mysetups_setup_updated", onUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      setupRequestId.current += 1;
      window.removeEventListener("mysetups_setup_updated", onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, [fetchSetups]);

  // Filtered tracks list
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        track.circuit.toLowerCase().includes(q) ||
        track.country.toLowerCase().includes(q) ||
        track.type?.toLowerCase().includes(q);

      return matchSearch;
    });
  }, [search]);

  // Selected track data
  const selectedTrack = useMemo(() => {
    return (
      tracks.find((t) => t.slug === selectedSlug) ||
      filteredTracks[0] ||
      tracks[0]
    );
  }, [selectedSlug, filteredTracks]);

  const selectedTrackIndex = useMemo(() => {
    return tracks.findIndex((t) => t.slug === selectedTrack.slug) + 1;
  }, [selectedTrack]);

  // Clean items formatted for AnimatedList
  const animatedItems = useMemo(() => {
    return filteredTracks.map((t) => {
      return {
        id: t.slug,
        slug: t.slug,
        title: t.circuit,
        description: t.country,
        meta: t.type,
        flagCode: t.flagCode,
      };
    });
  }, [filteredTracks]);

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col justify-between selection:bg-white/20 selection:text-white">
      <div>
        <NavBar />

        {/* Minimal Clean Header with Subtle Glassmorphism Fumé */}
        <section className="border-b border-white/[0.06] bg-[#0c0d15]/50 px-4 pt-28 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  Setup Ufficiali F1 26
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                  Configurazioni per tutti i 25 circuiti: Qualifica, Gara e Parco Chiuso.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search & Category Filter Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-6">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca circuito o nazione..."
                className="w-full rounded-xl border border-white/[0.08] bg-[#0c0d15]/80 py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-white/30"
              />
            </div>

          </div>

          {/* Lista dei circuiti e dettaglio assetto */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: AnimatedList */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              <div className="px-1 pb-1 text-xs text-zinc-300">
                <span className="font-semibold">Seleziona circuito</span>
              </div>

              <AnimatedList
                items={animatedItems}
                selectedId={selectedSlug}
                onItemSelect={(item) => {
                  setSelectedSlug(item.slug);
                }}
                theme="dark"
                width="100%"
                maxHeight={620}
                radius={16}
                frame={true}
                displayScrollbar={true}
                enableArrowNavigation={true}
              />
            </div>
            {/* Right Column: Full Setup Display Sheet */}
            <div className="lg:col-span-7">
              <SetupDisplay
                setup={setupsBySlug[selectedSlug] || null}
                isAuthorized={isAuthorized}
                loadError={setupError}
                onRetry={fetchSetups}
                trackName={selectedTrack.circuit}
                slug={selectedTrack.slug}
                track={selectedTrack}
              />
            </div>
          </div>

          {filteredTracks.length === 0 && (
            <div className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.01] p-12 text-center text-xs text-zinc-500">
              Nessun setup trovato per "{search}".
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
