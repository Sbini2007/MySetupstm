"use client";

import { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Quote,
  Star,
  Users,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TextType from "@/components/TextType";
import { safeFetchJson } from "@/lib/safe-json";
import { detailedReviews } from "@/lib/reviews";

export default function HomePage() {
  const [latestUpdate, setLatestUpdate] = useState(null);

  // Refresh latest setup on load and after admin saves in another tab.
  useEffect(() => {
    const refreshLatestUpdate = () => {
      safeFetchJson("/api/setups/latest", { cache: "no-store" }).then((data) => {
        if (data?.track) setLatestUpdate(data.track);
      });
    };
    const handleStorage = (event) => {
      if (event.key === "mysetups_last_updated") refreshLatestUpdate();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshLatestUpdate();
    };

    refreshLatestUpdate();
    window.addEventListener("mysetups_setup_updated", refreshLatestUpdate);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("mysetups_setup_updated", refreshLatestUpdate);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

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

        {/* ================= HERO SECTION ================= */}
        <section className="relative px-4 pt-32 pb-14 sm:px-6 sm:pt-36 lg:px-8 text-center max-w-5xl mx-auto overflow-hidden">
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
                className="group inline-flex items-center gap-2 rounded-xl bg-[#7048ff] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-violet-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-[#805dff] hover:shadow-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a12] motion-reduce:transform-none motion-reduce:transition-none sm:text-sm"
              >
                <span>Esplora i Setup</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
              </Link>
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
                      <span className="font-mono text-xs text-zinc-400">
                        {formattedUpdateDate}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                      {latestUpdate.circuit} ({latestUpdate.country})
                    </h3>
                  </div>
                </div>

                <div className="shrink-0 self-start md:self-center">
                  <Link
                    href="/setups"
                    className="group inline-flex items-center gap-2 rounded-xl bg-[#7048ff] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-950/25 transition duration-200 hover:-translate-y-0.5 hover:bg-[#805dff] hover:shadow-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a12] motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <span>Vedi Pista Aggiornata</span>
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= FEEDBACK DEI PILOTI ================= */}
        <section className="mx-auto max-w-6xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
          <div className="mb-5">
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              Feedback dei Piloti
            </h2>
          </div>

          <div className="grid auto-cols-[minmax(260px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-3 xl:auto-cols-auto xl:grid-flow-row xl:grid-cols-4 xl:overflow-visible">
            {detailedReviews.map((review) => (
              <article
                key={review.driver}
                onMouseMove={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
                  event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
                }}
                className="group relative flex min-h-64 flex-col overflow-hidden rounded-lg border border-white/[0.1] bg-[#0c0d15] p-5 transition-colors duration-300 hover:border-violet-300/40"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(220px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(139, 92, 246, 0.2), transparent 78%)",
                  }}
                />
                <div className="relative flex h-full flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-violet-400" aria-label="Valutazione">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} size={12} fill="none" strokeWidth={1.7} />
                      ))}
                    </div>
                    <Quote size={17} className="text-violet-300/70" aria-hidden="true" />
                  </div>
                  <p className="mt-5 flex-1 text-xs leading-relaxed text-zinc-300 sm:text-[13px]">
                    “{review.text}”
                  </p>
                  <div aria-hidden="true" className="mt-5 border-t border-white/[0.08]" />
                  <p className="mt-3 text-xs font-semibold text-white">{review.driver}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================= INTEGRAZIONE COMMUNITY DISCORD ================= */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-violet-400/[0.14] bg-gradient-to-br from-[#17132a] via-[#0d0d18] to-[#08090f] p-8 sm:p-12 shadow-2xl shadow-violet-950/15 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Entra nel Discord Ufficiale di F1 26
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Confrontati direttamente con i nostri piloti. Ricevi notifiche in tempo reale al rilascio di nuovi assetti dopo ogni patch ufficiale di F1 26 e assistenza sui setup in caso di necessità.
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-start sm:items-center gap-3">
                <a
                  href="https://discord.gg/YzVN3ncCwR"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#5865F2] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#5865F2]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#4752c4] hover:shadow-[#5865F2]/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aab0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a12] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <Users size={18} />
                  <span>Unisciti alla Community Discord</span>
                  <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
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