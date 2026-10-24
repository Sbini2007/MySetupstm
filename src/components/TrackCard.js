"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gauge, Wind, Zap } from "lucide-react";

function getTrackAeroDetails(track) {
  const t = (track.type || "").toLowerCase();
  const slug = track.slug || "";

  if (slug === "monza" || slug === "italy-monza" || slug === "usa-las-vegas" || slug === "belgium" || slug === "saudi-arabia" || slug === "azerbaijan") {
    return { level: 1, label: "Basso Carico", wing: "18 / 14" };
  }
  if (slug === "monaco" || slug === "hungary" || slug === "singapore" || slug === "netherlands") {
    return { level: 5, label: "Max Carico", wing: "48 / 44" };
  }
  if (t.includes("alto") || slug === "japan" || slug === "united-kingdom" || slug === "qatar") {
    return { level: 4, label: "Alto Carico", wing: "38 / 34" };
  }
  return { level: 3, label: "Medio Carico", wing: "28 / 24" };
}

export default function TrackCard({ track, locked, index }) {
  const roundStr = index !== undefined ? `R${String(index + 1).padStart(2, "0")}` : null;
  const aero = getTrackAeroDetails(track);

  return (
    <Link
      href={`/circuiti/${track.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0f1017] to-[#09090d] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_10px_30px_rgba(255,255,255,0.03)]"
    >
      <div>
        {/* Header: Round + Flag + Season Tag */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {roundStr && (
              <span className="font-mono text-[11px] font-bold text-zinc-200 bg-white/[0.05] px-2 py-0.5 rounded border border-white/15">
                {roundStr}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <Image
                src={`/flags/${track.flagCode}.svg`}
                alt=""
                width={20}
                height={14}
                className="h-3.5 w-5 rounded-[2px] object-cover ring-1 ring-white/10"
              />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
                {track.country}
              </span>
            </div>
          </div>

          <span className="font-mono text-[10px] text-zinc-500 font-medium">
            2026 SPEC
          </span>
        </div>

        {/* Circuit Name & Type */}
        <div className="mt-4">
          <h3 className="text-base font-bold text-white transition-colors duration-200 group-hover:text-zinc-200">
            {track.circuit}
          </h3>
          <p className="mt-1 text-xs text-zinc-400 font-medium">
            {track.type}
          </p>
        </div>

        {/* Telemetry specs preview */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Carico Aero</span>
            <span className="font-mono text-xs font-semibold text-zinc-200">{aero.label}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Ali Base</span>
            <span className="font-mono text-xs font-semibold text-cyan-300">{aero.wing}</span>
          </div>
        </div>
      </div>

      {/* Footer: Setup Badges & Action */}
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3.5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="rounded-md bg-white/[0.04] border border-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-zinc-300">
            Gara
          </span>
          <span className="rounded-md bg-white/[0.04] border border-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-zinc-300">
            Quali
          </span>
          <span className="rounded-md bg-white/[0.04] border border-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-zinc-300">
            Wet
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
          <span>Assetto</span>
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-zinc-400 group-hover:text-white" />
        </span>
      </div>
    </Link>
  );
}
