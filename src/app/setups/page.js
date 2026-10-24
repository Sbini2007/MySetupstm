"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  LayoutGrid,
  ListFilter,
  ShieldCheck,
  Zap,
  Lock
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SetupDisplay from "@/components/SetupDisplay";
import AnimatedList from "@/components/AnimatedList";
import { tracks } from "@/lib/data";
import { safeFetchJson } from "@/lib/safe-json";

export default function SetupsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedSlug, setSelectedSlug] = useState("italy-monza");
  const [viewMode, setViewMode] = useState("split"); // "split" | "grid"
  const [setupData, setSetupData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loadingSetup, setLoadingSetup] = useState(false);

  // Instant local setup + background sync & live admin sync
  useEffect(() => {
    if (!selectedSlug) return;
    setSetupData(null);
    setIsAuthorized(null);
    const fetchSetup = () => {
      safeFetchJson(`/api/setups/${selectedSlug}`, { cache: "no-store" }).then((data) => {
        if (data) {
          setIsAuthorized(data.isAuthorized);
          setSetupData(data.isAuthorized ? data.setup : null);
        }
      });
    };

    fetchSetup();

    const onUpdate = (e) => {
      if (!e?.detail?.slug || e.detail.slug === selectedSlug) {
        fetchSetup();
      }
    };
    window.addEventListener("mysetups_setup_updated", onUpdate);
    window.addEventListener("storage", fetchSetup);
    return () => {
      window.removeEventListener("mysetups_setup_updated", onUpdate);
      window.removeEventListener("storage", fetchSetup);
    };
  }, [selectedSlug]);

  // Filtered tracks list
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        track.circuit.toLowerCase().includes(q) ||
        track.country.toLowerCase().includes(q) ||
        track.type?.toLowerCase().includes(q);

      const matchType =
        filterType === "all" ||
        (filterType === "speed" &&
          (track.slug === "italy-monza" ||
            track.slug === "belgium" ||
            track.slug === "saudi-arabia" ||
            track.slug === "usa-las-vegas" ||
            track.slug === "azerbaijan")) ||
        (filterType === "street" &&
          (track.slug === "monaco" ||
            track.slug === "singapore" ||
            track.slug === "azerbaijan" ||
            track.slug === "usa-miami" ||
            track.slug === "usa-las-vegas" ||
            track.type?.toLowerCase().includes("cittadino"))) ||
        (filterType === "downforce" &&
          (track.slug === "monaco" ||
            track.slug === "hungary" ||
            track.slug === "singapore" ||
            track.slug === "japan" ||
            track.slug === "netherlands" ||
            track.slug === "qatar"));

      return matchSearch && matchType;
    });
  }, [search, filterType]);

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
      const origIdx = tracks.findIndex((orig) => orig.slug === t.slug);
      const round = `R${String(origIdx + 1).padStart(2, "0")}`;

      return {
        id: t.slug,
        slug: t.slug,
        title: t.circuit,
        description: t.country,
        meta: t.type,
        flagCode: t.flagCode,
        round: round,
      };
    });
  }, [filteredTracks]);

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col justify-between selection:bg-white/20 selection:text-white">
      <div>
        <NavBar />

        {/* Minimal Clean Header with Subtle Glassmorphism Fumé */}
        <section className="border-b border-white/[0.06] bg-[#0c0d15]/50 px-4 pt-24 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  Setup Ufficiali F1 26
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                  Configurazioni per tutti i 24 Gran Premi: Qualifica, Gara e Parco Chiuso.
                </p>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-[#0c0d15] p-1 self-start md:self-auto shrink-0 shadow-inner">
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === "split"
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <ListFilter size={13} />
                  <span>Lista</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === "grid"
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid size={13} />
                  <span>Griglia</span>
                </button>
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

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: `Tutti (${tracks.length})` },
                { id: "speed", label: "Top Speed & DRS" },
                { id: "street", label: "Cittadini" },
                { id: "downforce", label: "Alto Carico" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    filterType === tab.id
                      ? "bg-white text-black shadow-md"
                      : "border border-white/[0.08] bg-[#0c0d15]/60 text-zinc-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {viewMode === "split" ? (
            /* Split View: Left AnimatedList, Right Full Setup Display */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: AnimatedList */}
              <div className="lg:col-span-5 flex flex-col gap-2">
                <div className="flex items-center justify-between px-1 text-xs text-zinc-400 pb-1">
                  <span className="font-semibold text-zinc-300">
                    Seleziona circuito ({filteredTracks.length})
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                    ↑ ↓ frecce tastiera
                  </span>
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
                  setup={setupData}
                  isAuthorized={isAuthorized}
                  trackName={selectedTrack.circuit}
                  slug={selectedTrack.slug}
                  track={selectedTrack}
                />
              </div>
            </div>
          ) : (
            /* Grid View: Clean & Minimal Cards with crisp borders */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTracks.map((track) => {
                const trackIndex = tracks.findIndex((t) => t.slug === track.slug) + 1;
                const isSelected = selectedSlug === track.slug;

                return (
                  <div
                    key={track.slug}
                    onClick={() => {
                      setSelectedSlug(track.slug);
                      setViewMode("split");
                    }}
                    className={`group cursor-pointer rounded-2xl border p-5 transition duration-200 ${
                      isSelected
                        ? "border-white/30 bg-white/[0.06] shadow-lg"
                        : "border-white/[0.08] bg-[#0c0d15]/80 hover:border-white/20 hover:bg-[#10111d]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-5 w-8 shrink-0 overflow-hidden rounded-[2px] border border-white/10 bg-black/40">
                        <Image
                          src={`/flags/${track.flagCode}.svg`}
                          alt=""
                          width={32}
                          height={20}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 font-bold block">
                          ROUND {String(trackIndex).padStart(2, "0")} · {track.country.toUpperCase()}
                        </span>
                        <h3 className="font-bold text-white text-sm group-hover:text-zinc-200 transition">
                          {track.circuit}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
                      <span className="text-zinc-500 text-[11px]">{track.type}</span>
                      <span className="inline-flex items-center gap-1 text-zinc-300 font-semibold text-xs group-hover:text-white group-hover:translate-x-0.5 transition">
                        <span>Vedi Assetto</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
