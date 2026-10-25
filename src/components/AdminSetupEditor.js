"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { tracks } from "@/lib/data";
import { SETUP_SECTIONS, SETUP_TABS, tabToPrefix, clampValue } from "@/lib/setup-sections";
import { safeFetchJson } from "@/lib/safe-json";

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
    safeFetchJson("/api/admin/setups", { cache: "no-store" })
      .then((data) => {
        setAll(data?.setups || {});
        setDefaults(data?.defaults || {});
      })
      .catch(() => {
        setErrorMsg("Impossibile caricare i setup.");
      });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;
    const fallback = defaults[selectedSlug] || {};
    const stored = all?.[selectedSlug] || {};
    setDraft({ ...fallback, ...stored });
  }, [all, defaults, selectedSlug]);

  const currentTrack = tracks.find((track) => track.slug === selectedSlug) || tracks[0];
  const prefix = tabToPrefix(activeTab);

  const setParamValue = (suffix, value) => {
    const numericValue = Number(value);
    const clampedValue = clampValue(suffix, numericValue);
    setDraft((previous) => ({ ...previous, [`${prefix}${suffix}`]: clampedValue }));
  };

  const getParamValue = (suffix, fallback) => {
    if (!draft) return fallback;
    const value = draft[`${prefix}${suffix}`];
    return value !== undefined && value !== null && value !== "" ? value : fallback;
  };

  const handleSave = async () => {
    if (!draft || !currentTrack) return;
    setSaving(true);
    setMsg("");
    setErrorMsg("");

    try {
      const response = await fetch("/api/admin/setups", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedSlug, setup: draft }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrorMsg(data.error || "Errore durante il salvataggio.");
        return;
      }

      setMsg("Setup salvato.");
      load();
      window.dispatchEvent(
        new CustomEvent("mysetups_setup_updated", { detail: { slug: selectedSlug } })
      );
    } catch {
      setErrorMsg("Errore di connessione durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (!currentTrack || !window.confirm(`Ripristinare i valori predefiniti per ${currentTrack.circuit}?`)) {
      return;
    }
    setDraft(defaults[selectedSlug] || {});
    setMsg("Valori predefiniti ripristinati. Salva per confermare.");
    setErrorMsg("");
  };

  if (!currentTrack) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={`/flags/${currentTrack.flagCode}.svg`}
            alt=""
            width={40}
            height={28}
            className="h-7 w-10 rounded-sm object-cover"
          />
          <h2 className="text-lg font-bold text-white">{currentTrack.circuit}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Circuito"
            value={selectedSlug}
            onChange={(event) => setSelectedSlug(event.target.value)}
            className="min-w-0 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none"
          >
            {tracks.map((track) => (
              <option key={track.slug} value={track.slug} className="bg-[#0c0d16]">
                {track.circuit}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-2 py-2 text-sm text-zinc-400 transition hover:text-white"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !draft}
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {saving ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>

      {(msg || errorMsg) && (
        <p role={errorMsg ? "alert" : "status"} className={`text-sm ${errorMsg ? "text-red-300" : "text-zinc-300"}`}>
          {errorMsg || msg}
        </p>
      )}

      <div className="flex gap-6 border-b border-white/10">
        {SETUP_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-1 py-3 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "border-violet-400 text-white"
                : "border-transparent text-zinc-500 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-white/10">
        {SETUP_SECTIONS.map((section) => (
          <section key={section.title} className="py-5 first:pt-0">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
              {section.title}
            </h3>
            <div className="space-y-5">
              {section.fields.map((field) => {
                const value = getParamValue(field.suffix, field.default);
                return (
                  <div key={field.suffix} className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor={`setup-${field.suffix}`}
                        className="text-sm text-zinc-200"
                      >
                        {field.label}
                      </label>
                      <output
                        htmlFor={`setup-${field.suffix}`}
                        className="min-w-16 text-right font-mono text-sm font-semibold tabular-nums text-white"
                      >
                        {value}{field.unit}
                      </output>
                    </div>
                    <input
                      id={`setup-${field.suffix}`}
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={value}
                      onChange={(event) => setParamValue(field.suffix, event.target.value)}
                      className="w-full cursor-pointer accent-violet-400"
                    />
                    <div className="flex justify-between font-mono text-[10px] text-zinc-600">
                      <span>{field.min}{field.unit}</span>
                      <span>{field.max}{field.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
