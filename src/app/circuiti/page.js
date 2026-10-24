"use client";

import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { tracks } from "@/lib/data";

export default function CircuitiPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050508] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.08),transparent_25%)]" />
      <div className="track-grid pointer-events-none absolute inset-0 opacity-60" />

      <NavBar />

      <main className="relative mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(135deg,rgba(17,17,24,0.96),rgba(9,10,15,0.92))] p-6 shadow-[0_25px_80px_rgba(88,28,135,0.18)] sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),transparent_30%)]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-violet-400/20 bg-violet-500/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.32em] text-violet-200/90">
                Circuiti
              </span>
              <h1 className="mt-5 text-4xl font-black tracking-[-0.07em] text-white sm:text-5xl lg:text-6xl">
                Tutte le piste F1 26
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                Apri una pista per vedere i setup <strong className="text-white">Gara</strong>, <strong className="text-white">Qualifica</strong> e{" "}
                <strong className="text-white">Bagnato</strong>, se abilitati per il tuo account.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/55">
              {[
                { label: "Piste", value: "24" },
                { label: "Setup", value: "3x" },
                { label: "Status", value: "Live" },
              ].map((item) => (
                <div key={item.label} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2">
                  <span className="text-white/45">{item.label}</span>
                  <span className="ml-2 font-black text-violet-100">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tracks.map((track, index) => (
            <Link
              key={track.slug}
              href={`/circuiti/${track.slug}`}
              className="group relative flex min-h-[200px] flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,17,21,0.94),rgba(12,12,17,0.9))] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/40"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.08),transparent_42%,rgba(59,130,246,0.08)_100%)] opacity-0 transition duration-200 group-hover:opacity-100" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="text-[9px] font-black uppercase tracking-[0.24em] text-violet-200/80">
                  R{String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-2 rounded-full border border-white/8 bg-black/20 px-2 py-1.5 shadow-inner shadow-white/[0.04]">
                  <Image
                    src={`/flags/${track.flagCode}.svg`}
                    alt=""
                    width={34}
                    height={24}
                    style={{ width: "auto", height: "auto" }}
                    className="h-5 w-7 rounded-sm object-cover shadow-sm ring-1 ring-white/10"
                  />
                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/60">{track.country}</span>
                </div>
              </div>

              <div className="relative z-10 mt-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/42">{track.type}</p>
                <h2 className="mt-2 text-[1.15rem] font-black leading-[1.1] tracking-[-0.05em] text-white group-hover:text-violet-100">
                  {track.circuit}
                </h2>
              </div>

              <div className="relative z-10 mt-auto flex items-center justify-between border-t border-white/8 pt-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/45">Apri</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/8 text-sm font-bold text-violet-100">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
