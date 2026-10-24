"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { tracks } from "@/lib/data";
import { SETUP_TABS, tabToPrefix, clampValue, PARAM_LIMITS } from "@/lib/setup-sections";
import { safeFetchJson } from "@/lib/safe-json";
import {
  Save,
  Check,
  AlertCircle,
  RotateCcw,
  Wind,
  Sliders,
  Disc,
  CircleDot,
  Gauge,
  Layers
} from "lucide-react";

export default function AdminSetupEditor() {
  const [all, setAll] = useState(null);
  const [defaults, setDefaults] = useState({});
  const [selectedSlug, setSelectedSlug] = useState(tracks[0]?.slug || "bahrain");
  const [draft, setDraft] = useState(null);
  const [activeTab, setActiveTab] = useState("quali");
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    safeFetchJson("/api/admin/setups", {
      cache: "no-store",
    })
      .then((d) => {
        setAll(d?.setups || {});
        setDefaults(d?.defaults || {});
      })
      .catch(() => setAll({}));
  };

  useEffect(() => {
    load();
  }, []);

  // When track changes or all setups load, initialize draft with stored values or default
  useEffect(() => {
    if (!selectedSlug) return;
    const fallback = defaults[selectedSlug] || {};
    const stored = all && all[selectedSlug] ? all[selectedSlug] : null;
    setDraft({ ...fallback, ...(stored || {}) });
  }, [all, defaults, selectedSlug]);

  const currentTrack = tracks.find((t) => t.slug === selectedSlug) || tracks[0];
  const prefix = tabToPrefix(activeTab);

  const setParamValue = (suffix, value) => {
    const key = `${prefix}${suffix}`;
    if (value === "") {
      setDraft((prev) => ({ ...prev, [key]: "" }));
      return;
    }
    const num = Number(value);
    const clamped = clampValue(suffix, num);
    setDraft((prev) => ({
      ...prev,
      [key]: clamped,
    }));
  };

  const getParamValue = (suffix, fallback) => {
    if (!draft) return fallback;
    const key = `${prefix}${suffix}`;
    const v = draft[key];
    return v !== undefined && v !== null ? v : fallback;
  };

  const currentTabObj = SETUP_TABS.find((t) => t.key === activeTab) || SETUP_TABS[0];

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/setups", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: selectedSlug, setup: draft }),
      });

      if (res.ok) {
        setMsg(`Setup per ${currentTrack.circuit} (${currentTrack.country}) salvato con successo!`);
        setTimeout(() => setMsg(""), 4000);
        load();
        try {
          window.dispatchEvent(
            new CustomEvent("mysetups_setup_updated", { detail: { slug: selectedSlug } })
          );
          localStorage.setItem("mysetups_last_updated", String(Date.now()));
        } catch {}
      } else {
        const e = await res.json().catch(() => ({}));
        setErrorMsg(e.error || "Errore durante il salvataggio.");
      }
    } catch {
      setErrorMsg("Errore di connessione col server.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (!window.confirm(`Ripristinare i valori predefiniti per ${currentTrack.circuit}?`)) return;
    setDraft(defaults[selectedSlug] || {});
    setMsg(`Valori reimpostati per ${currentTrack.circuit}. Clicca Salva per confermare.`);
    setTimeout(() => setMsg(""), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Circuit Selector & Header Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/40">
              <Image
                src={`/flags/${currentTrack.flagCode}.svg`}
                alt=""
                width={48}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                Editor Assetti F1 26 · Modifica Setup
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {currentTrack.circuit} ({currentTrack.country})
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-400 font-mono">Circuito:</label>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-xs font-bold text-white outline-none cursor-pointer"
              >
                {tracks.map((t, idx) => (
                  <option key={t.slug} value={t.slug} className="bg-[#0c0d16] text-white">
                    R{String(idx + 1).padStart(2, "0")} · {t.country} ({t.circuit})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetToDefault}
              title="Reimposta valori calcolati"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:bg-zinc-200 disabled:opacity-50 shadow-md cursor-pointer active:scale-95"
            >
              <Save size={14} />
              <span>{saving ? "Salvataggio..." : "Salva Setup"}</span>
            </button>
          </div>
        </div>

        {/* Success / Error Feedback */}
        {msg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <Check size={14} className="text-emerald-400 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <AlertCircle size={14} className="text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 3 Variations Selector: Qualifica, Gara, Parco Chiuso */}
        <div className="mt-5 border-t border-white/[0.08] pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Seleziona Variazione da Modificare:
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Editing: <strong className="text-white">{currentTabObj.label}</strong>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {SETUP_TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    active
                      ? "bg-white text-black shadow-md ring-1 ring-white/50"
                      : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editing List: Full-Width Horizontal Rectangles (One per row) */}
      <div className="flex flex-col gap-3.5">

        {/* 1. AERODINAMICA [0 - 50] */}
        <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <Wind size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  1. Aerodinamica
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Ali [0 - 50]</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Ala Anteriore</span>
                  <span className="font-mono font-bold text-white text-sm">{getParamValue("front_wing", 26)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={getParamValue("front_wing", 26)}
                  onChange={(e) => setParamValue("front_wing", e.target.value)}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Ala Posteriore</span>
                  <span className="font-mono font-bold text-white text-sm">{getParamValue("rear_wing", 22)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={getParamValue("rear_wing", 22)}
                  onChange={(e) => setParamValue("rear_wing", e.target.value)}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. TRASMISSIONE [0 - 100] */}
        <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <Sliders size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  2. Trasmissione
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Differenziale [0 - 100%]</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 text-[11px]">Diff. In Trazione (On-Throttle)</span>
                  <span className="font-mono font-bold text-white text-sm">{getParamValue("diff_on", 55)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={getParamValue("diff_on", 55)}
                  onChange={(e) => setParamValue("diff_on", e.target.value)}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 text-[11px]">Diff. In Rilascio (Off-Throttle)</span>
                  <span className="font-mono font-bold text-white text-sm">{getParamValue("diff_off", 50)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={getParamValue("diff_off", 50)}
                  onChange={(e) => setParamValue("diff_off", e.target.value)}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 text-[11px]">Freno Motore (Engine Braking)</span>
                  <span className="font-mono font-bold text-white text-sm">{getParamValue("engine_braking", 60)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={getParamValue("engine_braking", 60)}
                  onChange={(e) => setParamValue("engine_braking", e.target.value)}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. GEOMETRIA SOSPENSIONI (Lasciate così) */}
        <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <Layers size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  3. Geometria Sosp.
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Camber & Convergenza</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Camp. Ant. [-3.5 / -2.5]°</label>
                <input
                  type="number"
                  step="0.1"
                  min="-3.5"
                  max="-2.5"
                  value={getParamValue("front_camber", -2.8)}
                  onChange={(e) => setParamValue("front_camber", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Camp. Post. [-2.2 / -1.0]°</label>
                <input
                  type="number"
                  step="0.1"
                  min="-2.2"
                  max="-1.0"
                  value={getParamValue("rear_camber", -1.8)}
                  onChange={(e) => setParamValue("rear_camber", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Conv. Ant. [0.0 / 0.20]°</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.00"
                  max="0.20"
                  value={getParamValue("front_toe", 0.05)}
                  onChange={(e) => setParamValue("front_toe", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Conv. Post. [0.10 / 0.40]°</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.10"
                  max="0.40"
                  value={getParamValue("rear_toe", 0.15)}
                  onChange={(e) => setParamValue("rear_toe", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. SOSPENSIONI [Sosp 1-41, Barre 1-21, Altezze 15-60] */}
        <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <Gauge size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  4. Sospensioni
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Molle [1-41], Barre [1-21], Altezze [15-60]</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Sosp. Ant. [1-41]</label>
                <input
                  type="number"
                  min="1"
                  max="41"
                  value={getParamValue("front_suspension", 28)}
                  onChange={(e) => setParamValue("front_suspension", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Sosp. Post. [1-41]</label>
                <input
                  type="number"
                  min="1"
                  max="41"
                  value={getParamValue("rear_suspension", 14)}
                  onChange={(e) => setParamValue("rear_suspension", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Barra Ant. [1-21]</label>
                <input
                  type="number"
                  min="1"
                  max="21"
                  value={getParamValue("front_antiroll", 15)}
                  onChange={(e) => setParamValue("front_antiroll", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Barra Post. [1-21]</label>
                <input
                  type="number"
                  min="1"
                  max="21"
                  value={getParamValue("rear_antiroll", 8)}
                  onChange={(e) => setParamValue("rear_antiroll", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Altezza Ant. [15-60]</label>
                <input
                  type="number"
                  min="15"
                  max="60"
                  value={getParamValue("front_ride_height", 33)}
                  onChange={(e) => setParamValue("front_ride_height", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Altezza Post. [15-60]</label>
                <input
                  type="number"
                  min="15"
                  max="60"
                  value={getParamValue("rear_ride_height", 44)}
                  onChange={(e) => setParamValue("rear_ride_height", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. FRENI [0 - 100] */}
        <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <Disc size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  5. Freni
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Pressione & Ripartizione [0 - 100%]</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300">Pressione Freni</span>
                  <span className="font-mono font-bold text-white text-sm">{getParamValue("brake_pressure", 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={getParamValue("brake_pressure", 100)}
                  onChange={(e) => setParamValue("brake_pressure", e.target.value)}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300">Ripartizione Frenata (Brake Bias)</span>
                  <span className="font-mono font-bold text-white text-sm">{getParamValue("brake_bias", 54.5)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={getParamValue("brake_bias", 54.5)}
                  onChange={(e) => setParamValue("brake_bias", e.target.value)}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 6. PRESSIONE PNEUMATICI [Ant 23.5-29.5, Post 20.5-26.5] */}
        <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="lg:w-48 shrink-0 flex items-center gap-2.5 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-2 lg:pb-0 lg:pr-4">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
                <CircleDot size={16} className="text-zinc-200" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  6. Pressione Gomme
                </h3>
                <span className="text-[10px] text-zinc-400 block font-mono">Ant. [23.5 - 29.5], Post. [20.5 - 26.5] PSI</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Ant. SX [23.5-29.5]</label>
                <input
                  type="number"
                  step="0.1"
                  min="23.5"
                  max="29.5"
                  value={getParamValue("front_left_psi", 23.5)}
                  onChange={(e) => setParamValue("front_left_psi", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Ant. DX [23.5-29.5]</label>
                <input
                  type="number"
                  step="0.1"
                  min="23.5"
                  max="29.5"
                  value={getParamValue("front_right_psi", 23.5)}
                  onChange={(e) => setParamValue("front_right_psi", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Post. SX [20.5-26.5]</label>
                <input
                  type="number"
                  step="0.1"
                  min="20.5"
                  max="26.5"
                  value={getParamValue("rear_left_psi", 20.5)}
                  onChange={(e) => setParamValue("rear_left_psi", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-black/40 p-2.5">
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Post. DX [20.5-26.5]</label>
                <input
                  type="number"
                  step="0.1"
                  min="20.5"
                  max="26.5"
                  value={getParamValue("rear_right_psi", 20.5)}
                  onChange={(e) => setParamValue("rear_right_psi", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Save Bar */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-zinc-200 disabled:opacity-50 shadow-lg cursor-pointer active:scale-95"
        >
          <Save size={15} />
          <span>{saving ? "Salvataggio in corso..." : "Salva Modifiche Setup"}</span>
        </button>
      </div>
    </div>
  );
}
