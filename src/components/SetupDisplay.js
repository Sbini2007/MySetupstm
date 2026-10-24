"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  ArrowLeft,
  Wind,
  Sliders,
  Disc,
  CircleDot,
  Gauge,
  Zap,
  Layers,
  Flag,
  Sparkles,
  Info
} from "lucide-react";
import { SETUP_TABS, tabToPrefix } from "@/lib/setup-sections";
import { tracks } from "@/lib/data";
import { trackProfiles } from "@/lib/default-setups";

// Official technical specs for all 24 F1 26 championship tracks
const TRACK_SPECS = {
  "bahrain": { length: "5.412 km", corners: 15, drs: 3, lapRecord: "1:31.447" },
  "saudi-arabia": { length: "6.174 km", corners: 27, drs: 3, lapRecord: "1:27.511" },
  "australia": { length: "5.278 km", corners: 14, drs: 4, lapRecord: "1:19.813" },
  "japan": { length: "5.807 km", corners: 18, drs: 1, lapRecord: "1:30.983" },
  "china": { length: "5.451 km", corners: 16, drs: 2, lapRecord: "1:32.238" },
  "usa-miami": { length: "5.412 km", corners: 19, drs: 3, lapRecord: "1:29.708" },
  "italy-imola": { length: "4.909 km", corners: 19, drs: 1, lapRecord: "1:15.484" },
  "monaco": { length: "3.337 km", corners: 19, drs: 1, lapRecord: "1:12.909" },
  "spain": { length: "4.657 km", corners: 14, drs: 2, lapRecord: "1:16.330" },
  "canada": { length: "4.361 km", corners: 14, drs: 2, lapRecord: "1:13.078" },
  "austria": { length: "4.318 km", corners: 10, drs: 3, lapRecord: "1:05.619" },
  "united-kingdom": { length: "5.891 km", corners: 18, drs: 2, lapRecord: "1:27.097" },
  "hungary": { length: "4.381 km", corners: 14, drs: 2, lapRecord: "1:16.627" },
  "belgium": { length: "7.004 km", corners: 19, drs: 2, lapRecord: "1:46.286" },
  "netherlands": { length: "4.259 km", corners: 14, drs: 2, lapRecord: "1:11.097" },
  "italy-monza": { length: "5.793 km", corners: 11, drs: 2, lapRecord: "1:21.046" },
  "azerbaijan": { length: "6.003 km", corners: 20, drs: 2, lapRecord: "1:43.009" },
  "singapore": { length: "4.940 km", corners: 19, drs: 4, lapRecord: "1:35.867" },
  "usa-cota": { length: "5.513 km", corners: 20, drs: 2, lapRecord: "1:36.169" },
  "mexico": { length: "4.304 km", corners: 17, drs: 3, lapRecord: "1:17.774" },
  "brazil": { length: "4.309 km", corners: 15, drs: 2, lapRecord: "1:10.540" },
  "usa-las-vegas": { length: "6.201 km", corners: 17, drs: 2, lapRecord: "1:35.490" },
  "qatar": { length: "5.419 km", corners: 16, drs: 1, lapRecord: "1:24.319" },
  "abu-dhabi": { length: "5.281 km", corners: 16, drs: 2, lapRecord: "1:26.103" },
};

export default function SetupDisplay({
  setup,
  onBack,
  trackName = "Circuito",
  slug = "italy-monza",
  track,
}) {
  const [activeTab, setActiveTab] = useState("race"); // Default to race setup
  const [copied, setCopied] = useState(false);

  // Resolve track metadata & index
  const currentTrack = useMemo(() => {
    if (track) return track;
    return tracks.find((t) => t.slug === slug) || {
      slug,
      circuit: trackName,
      country: "F1 26",
      flagCode: "it",
      type: "Misto Tecnico",
    };
  }, [track, slug, trackName]);

  const trackIndex = useMemo(() => {
    const idx = tracks.findIndex((t) => t.slug === currentTrack.slug);
    return idx >= 0 ? idx + 1 : 1;
  }, [currentTrack]);

  const profile = useMemo(() => {
    return trackProfiles[currentTrack.slug] || trackProfiles["italy-monza"] || {};
  }, [currentTrack]);

  const specs = useMemo(() => {
    return TRACK_SPECS[currentTrack.slug] || {
      length: "5.250 km",
      corners: 16,
      drs: 2,
      lapRecord: "1:25.000",
    };
  }, [currentTrack]);

  if (!setup) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-8 text-center min-h-[360px] flex items-center justify-center">
        <div>
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white mb-3" />
          <p className="text-xs font-mono text-zinc-400">Caricamento Scheda Tecnica per {currentTrack.circuit}...</p>
        </div>
      </div>
    );
  }

  // Active variation prefix: "quali_", "race_", or "parc_ferme_"
  const prefix = tabToPrefix(activeTab);
  const p = (key, fallback) => {
    const prefixedVal = setup[`${prefix}${key}`];
    if (prefixedVal !== undefined && prefixedVal !== null && prefixedVal !== "") {
      return prefixedVal;
    }
    const baseVal = setup[key];
    if (baseVal !== undefined && baseVal !== null && baseVal !== "") {
      return baseVal;
    }
    return fallback;
  };

  // 1. Aerodinamica
  const frontWing = p("front_wing", 26);
  const rearWing = p("rear_wing", 22);

  // 2. Trasmissione
  const diffOn = p("diff_on", 55);
  const diffOff = p("diff_off", 50);
  const engineBraking = p("engine_braking", 60);

  // 3. Geometria Sospensioni
  const frontCamber = p("front_camber", -2.8);
  const rearCamber = p("rear_camber", -1.8);
  const frontToe = p("front_toe", 0.05);
  const rearToe = p("rear_toe", 0.15);

  // 4. Sospensioni
  const frontSusp = p("front_suspension", 28);
  const rearSusp = p("rear_suspension", 14);
  const frontArb = p("front_antiroll", 15);
  const rearArb = p("rear_antiroll", 8);
  const frontRide = p("front_ride_height", 33);
  const rearRide = p("rear_ride_height", 44);

  // 5. Freni
  const brakePressure = p("brake_pressure", 100);
  const brakeBias = p("brake_bias", 54.5);

  // 6. Pressione Pneumatici
  const flPsi = p("front_left_psi", 23.5);
  const frPsi = p("front_right_psi", 23.5);
  const rlPsi = p("rear_left_psi", 21.0);
  const rrPsi = p("rear_right_psi", 21.0);

  const currentTabObj = SETUP_TABS.find((t) => t.key === activeTab) || SETUP_TABS[0];

  // Tab-specific driving note
  const drivingNote = useMemo(() => {
    if (activeTab === "parc_ferme") {
      return (
        profile.notes?.parc_ferme ||
        "Assetto Parco Chiuso sigillato FIA. Bilanciamento ideale tra la rotazione da qualifica sul giro singolo e la preservazione del battistrada per l'intero stint di gara."
      );
    }
    if (activeTab === "quali") {
      return (
        profile.notes?.quali ||
        "Assetto qualifica configurato per il massimo grip al vertice, reattività nei cambi di direzione e accelerazione fulminea."
      );
    }
    return (
      profile.notes?.race ||
      "Assetto gara calibrato per garantire stabilità nei long run, gestione termica ottimale dei pneumatici e trazione costante in uscita di curva."
    );
  }, [profile, activeTab]);

  const copySetup = () => {
    const text = `=== MYSETUPS · ${currentTrack.circuit.toUpperCase()} (${currentTrack.country.toUpperCase()}) [${currentTabObj.label.toUpperCase()}] ===
Round ${String(trackIndex).padStart(2, "0")} · Lunghezza: ${specs.length} | Curve: ${specs.corners} | DRS: ${specs.drs}

1. AERODINAMICA:
- Ala Anteriore: ${frontWing}
- Ala Posteriore: ${rearWing}

2. TRASMISSIONE:
- Differenziale in Trazione (On-Throttle): ${diffOn}%
- Differenziale in Rilascio (Off-Throttle): ${diffOff}%
- Freno Motore (Engine Braking): ${engineBraking}%

3. GEOMETRIA SOSPENSIONI:
- Campanatura Anteriore (Front Camber): ${frontCamber}°
- Campanatura Posteriore (Rear Camber): ${rearCamber}°
- Convergenza Anteriore (Front Toe): ${frontToe}°
- Convergenza Posteriore (Rear Toe): ${rearToe}°

4. SOSPENSIONI:
- Sospensione Anteriore: ${frontSusp}
- Sospensione Posteriore: ${rearSusp}
- Barra Antirollio Anteriore (ARB): ${frontArb}
- Barra Antirollio Posteriore (ARB): ${rearArb}
- Altezza da Terra Anteriore: ${frontRide}
- Altezza da Terra Posteriore: ${rearRide}

5. FRENI:
- Pressione Freni: ${brakePressure}%
- Ripartizione Frenata (Brake Bias): ${brakeBias}% Anteriore

6. PRESSIONE PNEUMATICI:
- Anteriore Sinistra: ${flPsi} PSI | Anteriore Destra: ${frPsi} PSI
- Posteriore Sinistra: ${rlPsi} PSI | Posteriore Destra: ${rrPsi} PSI

Note Tecniche: "${drivingNote}"`;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= SCHEDA TECNICA UFFICIALE (CIRCUIT HEADER CARD) ================= */}
      <div className="rounded-2xl border border-white/[0.09] bg-[#0c0d15]/90 backdrop-blur-md p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Top bar with back button, Title, and Copy CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3.5">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-white mr-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Indietro</span>
              </button>
            ) : null}

            {/* Circuit Flag */}
            {currentTrack.flagCode && (
              <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/40 shadow-sm">
                <Image
                  src={`/flags/${currentTrack.flagCode}.svg`}
                  alt=""
                  width={48}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-zinc-300 bg-white/[0.06] px-2 py-0.5 rounded border border-white/15">
                  ROUND {String(trackIndex).padStart(2, "0")}
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  {currentTrack.country}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {currentTrack.circuit}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={copySetup}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-zinc-200 transition hover:border-white/35 hover:bg-white/[0.1] hover:text-white self-start sm:self-auto cursor-pointer shadow-sm active:scale-95"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? "Assetto Copiato!" : "Copia Assetto"}</span>
          </button>
        </div>

        {/* Official Circuit Technical Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4 text-xs">
          <div className="rounded-xl border border-white/[0.06] bg-black/35 p-2.5">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Lunghezza</span>
            <span className="font-mono text-xs font-bold text-white mt-0.5 block">{specs.length}</span>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/35 p-2.5">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Curve</span>
            <span className="font-mono text-xs font-bold text-white mt-0.5 block">{specs.corners} Curve</span>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/35 p-2.5">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Zone DRS</span>
            <span className="font-mono text-xs font-bold text-white mt-0.5 block">{specs.drs} Zone</span>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/35 p-2.5">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Carico Aero</span>
            <span className="font-mono text-xs font-bold text-white mt-0.5 block">{profile.downforce || "Bilanciato"}</span>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/35 p-2.5">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Usura Gomme</span>
            <span className="font-mono text-xs font-bold text-amber-300 mt-0.5 block">{profile.tyreStress || "Media"}</span>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/35 p-2.5">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Top Speed</span>
            <span className="font-mono text-xs font-bold text-white mt-0.5 block">{profile.topSpeed || "335 km/h"}</span>
          </div>
        </div>

        {/* ================= 3 VARIATION SELECTOR TABS: QUALIFICA, GARA, PARCO CHIUSO ================= */}
        <div className="mt-5 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Seleziona Assetto Specifico:
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Modalità: <strong className="text-white">{currentTabObj.label}</strong>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-black/40 p-1.5">
            {SETUP_TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-lg py-2.5 px-3 text-xs font-black uppercase tracking-wider text-center transition cursor-pointer active:scale-98 ${
                    active
                      ? "bg-white text-black shadow-md ring-1 ring-white/50"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Description & Engineering notes for the selected variation */}
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs">
            <Info size={14} className="text-zinc-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-zinc-200 font-semibold">{currentTabObj.desc}</span>
              <p className="text-zinc-400 mt-1 leading-relaxed text-[11px]">
                "{drivingNote}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SETUP PARAMETERS: VERTICALLY ARRANGED HORIZONTAL RECTANGLES ================= */}
      <div className="flex flex-col gap-3">

        {/* 1. AERODINAMICA - RETTANGOLO ORIZZONTALE */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/90 backdrop-blur-md p-4 sm:p-5 shadow-lg transition hover:border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Label on the left */}
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <Wind size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">
                  1. Aerodinamica
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Carico Alare & Bilanciamento</span>
              </div>
            </div>

            {/* Horizontal content sliders */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Front Wing */}
              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Ala Anteriore</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-lg font-black text-white">{frontWing}</span>
                    <span className="text-[10px] text-zinc-500">/ 50</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (frontWing / 50) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Rear Wing */}
              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Ala Posteriore</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-lg font-black text-white">{rearWing}</span>
                    <span className="text-[10px] text-zinc-500">/ 50</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full bg-zinc-300 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (rearWing / 50) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TRASMISSIONE - RETTANGOLO ORIZZONTALE */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/90 backdrop-blur-md p-4 sm:p-5 shadow-lg transition hover:border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Label */}
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <Sliders size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">
                  2. Trasmissione
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Differenziale & Freno Motore</span>
              </div>
            </div>

            {/* Horizontal 3 parameter blocks */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3 flex flex-col justify-between">
                <span className="text-[11px] text-zinc-400 block">Diff. In Trazione (On-Throttle)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-lg font-black text-white">{diffOn}%</span>
                  <span className="text-[10px] font-mono text-zinc-500">[0 - 100%]</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3 flex flex-col justify-between">
                <span className="text-[11px] text-zinc-400 block">Diff. In Rilascio (Off-Throttle)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-lg font-black text-white">{diffOff}%</span>
                  <span className="text-[10px] font-mono text-zinc-500">[0 - 100%]</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3 flex flex-col justify-between">
                <span className="text-[11px] text-zinc-400 block">Freno Motore (Engine Braking)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-lg font-black text-white">{engineBraking}%</span>
                  <span className="text-[10px] font-mono text-zinc-500">[0 - 100%]</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. GEOMETRIA SOSPENSIONI - RETTANGOLO ORIZZONTALE */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/90 backdrop-blur-md p-4 sm:p-5 shadow-lg transition hover:border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Label */}
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <Layers size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">
                  3. Geometria Sosp.
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Campanatura & Convergenza</span>
              </div>
            </div>

            {/* Horizontal 4 stats */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-2.5 text-center">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Camp. Anteriore</span>
                <span className="font-mono text-base font-black text-white mt-0.5 block">{frontCamber}°</span>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-2.5 text-center">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Camp. Posteriore</span>
                <span className="font-mono text-base font-black text-white mt-0.5 block">{rearCamber}°</span>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-2.5 text-center">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Conv. Anteriore</span>
                <span className="font-mono text-base font-black text-white mt-0.5 block">{frontToe}°</span>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-2.5 text-center">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Conv. Posteriore</span>
                <span className="font-mono text-base font-black text-white mt-0.5 block">{rearToe}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SOSPENSIONI - RETTANGOLO ORIZZONTALE */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/90 backdrop-blur-md p-4 sm:p-5 shadow-lg transition hover:border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Label */}
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <Gauge size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">
                  4. Sospensioni
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Molle, ARB & Altezze</span>
              </div>
            </div>

            {/* Horizontal 3 groups: Molle, ARB, Ride Height */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3">
                <span className="text-[11px] text-zinc-400 font-medium block">Rigidità Sospensioni</span>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="text-zinc-400">Ant: <strong className="text-white font-mono">{frontSusp}</strong></span>
                  <span className="text-zinc-400">Post: <strong className="text-white font-mono">{rearSusp}</strong></span>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3">
                <span className="text-[11px] text-zinc-400 font-medium block">Barre Antirollio (ARB)</span>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="text-zinc-400">Ant: <strong className="text-white font-mono">{frontArb}</strong></span>
                  <span className="text-zinc-400">Post: <strong className="text-white font-mono">{rearArb}</strong></span>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3">
                <span className="text-[11px] text-zinc-400 font-medium block">Altezza da Terra</span>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="text-zinc-400">Ant: <strong className="text-white font-mono">{frontRide}</strong></span>
                  <span className="text-zinc-400">Post: <strong className="text-white font-mono">{rearRide}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. FRENI - RETTANGOLO ORIZZONTALE */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/90 backdrop-blur-md p-4 sm:p-5 shadow-lg transition hover:border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Label */}
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <Disc size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">
                  5. Freni
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Pressione & Ripartizione</span>
              </div>
            </div>

            {/* Horizontal content */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Pressione Freni</span>
                  <span className="font-mono text-lg font-black text-white">{brakePressure}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${brakePressure}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/30 p-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Ripartizione Frenata (Brake Bias)</span>
                  <span className="font-mono text-lg font-black text-white">{brakeBias}% <span className="text-[10px] text-zinc-400 font-normal">Ant</span></span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full bg-white/80 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, brakeBias))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. PRESSIONE PNEUMATICI - RETTANGOLO ORIZZONTALE */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/90 backdrop-blur-md p-4 sm:p-5 shadow-lg transition hover:border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Label */}
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <CircleDot size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">
                  6. Pressione Gomme
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Pressioni Pirelli F1 26</span>
              </div>
            </div>

            {/* Horizontal 4 tyres in single row */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-400 block">Ant. SX (FL)</span>
                <span className="font-mono text-base font-black text-white mt-0.5 block">{flPsi} <span className="text-[10px] font-normal text-zinc-500">PSI</span></span>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-400 block">Ant. DX (FR)</span>
                <span className="font-mono text-base font-black text-white mt-0.5 block">{frPsi} <span className="text-[10px] font-normal text-zinc-500">PSI</span></span>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-400 block">Post. SX (RL)</span>
                <span className="font-mono text-base font-black text-white mt-0.5 block">{rlPsi} <span className="text-[10px] font-normal text-zinc-500">PSI</span></span>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-2.5 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-400 block">Post. DX (RR)</span>
                <span className="font-mono text-base font-black text-white mt-0.5 block">{rrPsi} <span className="text-[10px] font-normal text-zinc-500">PSI</span></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
