"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Lock } from "lucide-react";
import { PARAM_LIMITS, SETUP_TABS, tabToPrefix } from "@/lib/setup-sections";
import { tracks } from "@/lib/data";

export default function SetupDisplay({
  setup,
  isAuthorized = true,
  loadError = false,
  onRetry,
  onBack,
  trackName = "Circuito",
  slug = "italy-monza",
  track,
}) {
  const [activeTab, setActiveTab] = useState("race");

  const currentTrack = useMemo(() => {
    if (track) return track;
    return tracks.find((item) => item.slug === slug) || {
      slug,
      circuit: trackName,
      country: "F1 26",
      flagCode: "it",
    };
  }, [track, slug, trackName]);

  const trackIndex = useMemo(() => {
    const index = tracks.findIndex((item) => item.slug === currentTrack.slug);
    return index >= 0 ? index + 1 : 1;
  }, [currentTrack]);

  if (isAuthorized === false) {
    return (
      <div className="border-y border-white/10 py-8 text-center">
        <Lock size={20} className="mx-auto text-zinc-500" />
        <h2 className="mt-3 text-sm font-bold uppercase tracking-wide text-white">Accesso riservato</h2>
        <p className="mt-1 text-xs text-zinc-400">Contatta lo staff per richiedere l'accesso a questi setup.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 border-y border-white/10">
        <p role="alert" className="text-xs text-zinc-400">
          Impossibile caricare i setup. Controlla la connessione e riprova.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs font-semibold text-violet-300 transition hover:text-white"
          >
            Riprova
          </button>
        )}
      </div>
    );
  }

  if (!setup) {
    return (
      <div className="flex min-h-40 items-center justify-center border-y border-white/10">
        <p className="text-xs font-mono text-zinc-400">Caricamento setup per {currentTrack.circuit}...</p>
      </div>
    );
  }

  const prefix = tabToPrefix(activeTab);
  const value = (key, fallback) => {
    const tabValue = setup[`${prefix}${key}`];
    if (tabValue !== undefined && tabValue !== null && tabValue !== "") return tabValue;
    const baseValue = setup[key];
    if (baseValue !== undefined && baseValue !== null && baseValue !== "") return baseValue;
    return fallback;
  };

  const parameterSections = [
    {
      title: "Aerodinamica",
      rows: [
        { label: "Ala anteriore", key: "front_wing", value: value("front_wing", 26) },
        { label: "Ala posteriore", key: "rear_wing", value: value("rear_wing", 22) },
      ],
    },
    {
      title: "Trasmissione",
      rows: [
        { label: "Differenziale in trazione", key: "diff_on", value: value("diff_on", 55), unit: "%" },
        { label: "Differenziale in rilascio", key: "diff_off", value: value("diff_off", 50), unit: "%" },
      ],
    },
    {
      title: "Geometria sospensioni",
      rows: [
        { label: "Campanatura anteriore", key: "front_camber", value: value("front_camber", -2.8), unit: "°" },
        { label: "Campanatura posteriore", key: "rear_camber", value: value("rear_camber", -1.8), unit: "°" },
        { label: "Convergenza anteriore", key: "front_toe", value: value("front_toe", 0.05), unit: "°" },
        { label: "Convergenza posteriore", key: "rear_toe", value: value("rear_toe", 0.15), unit: "°" },
      ],
    },
    {
      title: "Sospensioni",
      rows: [
        { label: "Sospensione anteriore", key: "front_suspension", value: value("front_suspension", 28) },
        { label: "Sospensione posteriore", key: "rear_suspension", value: value("rear_suspension", 14) },
        { label: "Barra antirollio anteriore", key: "front_antiroll", value: value("front_antiroll", 15) },
        { label: "Barra antirollio posteriore", key: "rear_antiroll", value: value("rear_antiroll", 8) },
        { label: "Altezza da terra anteriore", key: "front_ride_height", value: value("front_ride_height", 33) },
        { label: "Altezza da terra posteriore", key: "rear_ride_height", value: value("rear_ride_height", 44) },
      ],
    },
    {
      title: "Freni",
      rows: [
        { label: "Pressione freni", key: "brake_pressure", value: value("brake_pressure", 100), unit: "%" },
        { label: "Ripartizione frenata anteriore", key: "brake_bias", value: value("brake_bias", 54.5), unit: "%" },
      ],
    },
    {
      title: "Pressione pneumatici",
      rows: [
        { label: "Anteriore sinistra", key: "front_left_psi", value: value("front_left_psi", 23.5), unit: " PSI" },
        { label: "Anteriore destra", key: "front_right_psi", value: value("front_right_psi", 23.5), unit: " PSI" },
        { label: "Posteriore sinistra", key: "rear_left_psi", value: value("rear_left_psi", 21), unit: " PSI" },
        { label: "Posteriore destra", key: "rear_right_psi", value: value("rear_right_psi", 21), unit: " PSI" },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              <span>Indietro</span>
            </button>
          )}
          {currentTrack.flagCode && (
            <Image
              src={`/flags/${currentTrack.flagCode}.svg`}
              alt=""
              width={40}
              height={28}
              className="h-7 w-10 rounded-sm object-cover"
            />
          )}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Round {String(trackIndex).padStart(2, "0")} · {currentTrack.country}
            </p>
            <h2 className="text-lg font-black tracking-tight text-white">{currentTrack.circuit}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-y border-white/10">
        {SETUP_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`py-2.5 text-xs font-bold transition ${
                active
                  ? "border-b-2 border-violet-400 text-violet-300"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="divide-y divide-white/10 border-y border-white/10">
        {parameterSections.map((section) => (
          <section key={section.title} className="py-4">
            <h3 className="pb-3 text-xs font-bold uppercase tracking-wider text-violet-300">
              {section.title}
            </h3>
            <dl className="space-y-3">
              {section.rows.map(({ label, key, value: rowValue, unit = "" }) => {
                const bounds = PARAM_LIMITS[key];
                const numericValue = Number(rowValue);
                const percentage =
                  bounds && Number.isFinite(numericValue)
                    ? Math.max(0, Math.min(100, ((numericValue - bounds.min) / (bounds.max - bounds.min)) * 100))
                    : 0;

                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-xs text-zinc-300">{label}</dt>
                      <dd className="font-mono text-xs font-semibold tabular-nums text-white">
                        {rowValue}{unit}
                      </dd>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={label}
                      aria-valuemin={bounds?.min}
                      aria-valuemax={bounds?.max}
                      aria-valuenow={Number.isFinite(numericValue) ? numericValue : undefined}
                      className="h-1 w-full overflow-hidden rounded-full bg-white/10"
                    >
                      <div
                        className="h-full rounded-full bg-violet-400 transition-[width]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
