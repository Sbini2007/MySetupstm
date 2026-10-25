"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/client-auth";
import {
  Search,
  ArrowRight,
  Sliders,
  Wind,
  Disc,
  Copy,
  Check,
  Flame,
  Trophy,
  ArrowUpRight,
  Clock,
  MessageSquare,
  Users,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AnimatedList from "@/components/AnimatedList";
import SetupDisplay from "@/components/SetupDisplay";
import TextType from "@/components/TextType";
import { tracks } from "@/lib/data";
import { SETUP_TABS } from "@/lib/setup-sections";
import { safeFetchJson } from "@/lib/safe-json";

export default function HomePage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("italy-monza");
  const [latestUpdate, setLatestUpdate] = useState(null);
  const [currentSetup, setCurrentSetup] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);

  // Fetch latest track update dynamically
  useEffect(() => {
    safeFetchJson("/api/setups/latest", { cache: "no-store" }).then((d) => {
      if (d?.track) setLatestUpdate(d.track);
    });
  }, []);

  // Fetch or load setup for selected track with instant fallback & live admin sync
  useEffect(() => {
    if (!selectedSlug) return;
    setCurrentSetup(null);
    setIsAuthorized(null);
    const fetchSetup = () => {
      safeFetchJson(`/api/setups/${selectedSlug}`, { cache: "no-store" }).then((data) => {
        if (data) {
          setIsAuthorized(data.isAuthorized);
          setCurrentSetup(data.isAuthorized ? data.setup : null);
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

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tracks;
    return tracks.filter(
      (t) =>
        t.circuit.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q) ||
        t.type?.toLowerCase().includes(q)
    );
  }, [search]);

  // Selected track details
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
  const listItems = useMemo(() => {
    return filteredTracks.map((t) => {
      const origIdx = tracks.findIndex((orig) => orig.slug === t.slug);
      const round = `R${String(origIdx + 1).padStart(2, "0")}`;
      return {
        id: t.slug,
        slug: t.slug,
        title: t.circuit,
        description: t.country,
        flagCode: t.flagCode,
        round: round,
      };
    });
  }, [filteredTracks]);

  const formattedUpdateDate = useMemo(() => {
    if (!latestUpdate?.updatedAt) return "Stagione F1 26";
    try {
      const d = new Date(latestUpdate.updatedAt);
      return d.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Recente";
    }
  }, [latestUpdate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0b18] via-[#07070a] to-[#07070a] text-zinc-100 flex flex-col justify-between selection:bg-violet-500/30 selection:text-white">
      <div>
        <NavBar />

        {/* ================= HERO SECTION (IMPATTO, ACCOGLIENTE CON LOGO AL CENTRO) ================= */}
        <section className="relative px-4 pt-24 pb-14 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto overflow-hidden">
          {/* Hero Background Atmosphere */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <Image
              src="/assets/aistudio/image_e54ac127.png"
              alt=""
              fill
              priority
              className="object-cover object-center opacity-30 select-none scale-105"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(82,39,255,0.2),transparent_55%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b18]/45 via-[#07070a]/85 to-[#07070a]" />
          </div>

          {/* Animated hero title replacing the centered logo */}
          <div className="relative mx-auto flex flex-col items-center">
            <TextType />

            <p className="mt-5 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              L'hub di riferimento per gli assetti competitivi su <strong className="text-zinc-200">F1 26</strong>. 
              Configurazioni tecniche su misura per tutti i 25 circuiti, calibrate con precisione per Qualifica, Gara e Parco Chiuso.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/setups"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5227ff] to-[#8b5cf6] px-6 py-3 text-xs sm:text-sm font-bold text-white transition hover:brightness-110 shadow-lg shadow-violet-950/40"
              >
                <span>Esplora i Setup</span>
                <ArrowRight size={14} />
              </Link>

              <a
                href="https://discord.gg/YzVN3ncCwR"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/[0.06] px-5 py-3 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:border-violet-400/40 hover:bg-violet-500/[0.12] hover:text-white"
              >
                <Users size={15} className="text-violet-300" />
                <span>Community Discord</span>
                <ArrowUpRight size={12} className="text-violet-300/70" />
              </a>

            </div>
          </div>
        </section>

        {/* ================= SEZIONE DINAMICA "ULTIMO AGGIORNAMENTO" ================= */}
        {latestUpdate && (
          <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-violet-400/[0.14] bg-gradient-to-br from-[#151226]/90 via-[#0c0d15]/90 to-[#0c0d15]/80 backdrop-blur-md p-5 sm:p-6 shadow-xl shadow-violet-950/10 relative overflow-hidden transition duration-200 hover:border-violet-400/25">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex items-start gap-4">
                  {/* Flag */}
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                    <Image
                      src={`/flags/${latestUpdate.flagCode}.svg`}
                      alt=""
                      width={48}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span                       className="inline-flex items-center gap-1.5 rounded-md border border-violet-400/20 bg-violet-500/[0.06] px-2.5 py-0.5 font-mono text-[10px] font-bold text-zinc-300 uppercase">
                        <Clock size={11} className="text-violet-300" />
                        ULTIMO AGGIORNAMENTO F1 26
                      </span>
                      <span className="font-mono text-xs text-zinc-400">
                        {formattedUpdateDate}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                      {latestUpdate.circuit} ({latestUpdate.country})
                    </h3>

                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      Variazione modificata: <strong className="text-zinc-200">{latestUpdate.variation}</strong>
                    </p>

                    <p className="mt-1.5 text-xs text-zinc-400 max-w-2xl leading-relaxed">
                      "{latestUpdate.notes}"
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-start md:self-center">
                  <button
                    type="button"
                    onClick={() => setSelectedSlug(latestUpdate.slug)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5227ff] to-[#8b5cf6] px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-110"
                  >
                    <span>Vedi Pista Aggiornata</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= EXPLORER SETUP F1 26 (SELEZIONE CIRCUITO + SCHEDA DETTAGLIATA) ================= */}
        <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Circuit Selection List */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span className="font-semibold text-zinc-200">
                  Seleziona circuito ({filteredTracks.length})
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Calendario F1 26
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cerca per circuito o nazione..."
                  className="w-full rounded-xl border border-violet-400/[0.14] bg-[#0c0d15]/80 backdrop-blur-md py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              {/* Robust AnimatedList Component */}
              <AnimatedList
                items={listItems}
                selectedId={selectedSlug}
                onItemSelect={(item) => {
                  setSelectedSlug(item.slug);
                }}
                theme="dark"
                width="100%"
                maxHeight={580}
                radius={16}
                frame={true}
                displayScrollbar={true}
                enableArrowNavigation={true}
              />
            </div>

            {/* Setup display; access is controlled by account permissions. */}
            <div className="lg:col-span-7">
              <SetupDisplay
                setup={currentSetup}
                isAuthorized={isAuthorized}
                trackName={selectedTrack.circuit}
                slug={selectedTrack.slug}
                track={selectedTrack}
              />
            </div>
          </div>
        </main>

        {/* ================= INTEGRAZIONE COMMUNITY DISCORD ================= */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-violet-400/[0.14] bg-gradient-to-br from-[#17132a] via-[#0d0d18] to-[#08090f] p-8 sm:p-12 shadow-2xl shadow-violet-950/15 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.06] px-3.5 py-1 text-xs font-mono font-semibold text-zinc-300 mb-3">
                  <MessageSquare size={13} className="text-violet-300" />
                  <span>COMMUNITY UFFICIALE MYSETUPS</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Entra nel Discord Ufficiale di F1 26
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Confrontati direttamente con i nostri ingegneri di pista e i piloti di lega.
                  Ricevi notifiche in tempo reale al rilascio di nuovi assetti dopo ogni patch ufficiale di F1 26, canali telemetria dedicati per ogni GP e assistenza su volanti Direct Drive e Gamepad.
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-400" />
                    <span>Canali per tutti i 25 circuiti</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-400" />
                    <span>Aggiornamenti Post-Patch</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-start sm:items-center gap-3">
                <a
                  href="https://discord.gg/YzVN3ncCwR"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#5865F2] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#4752c4] shadow-lg"
                >
                  <Users size={18} />
                  <span>Unisciti alla Community Discord</span>
                  <ArrowUpRight size={16} />
                </a>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Accesso gratuito aperto a tutti i piloti
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}