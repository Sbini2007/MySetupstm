"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import AnimatedList from "@/components/AnimatedList";
import { tracks } from "@/lib/data";
import { SETUP_SECTIONS, SETUP_TABS, tabToPrefix, clampValue } from "@/lib/setup-sections";
import { safeFetchJson } from "@/lib/safe-json";

export default function AdminSetupEditor() {
  const [all, setAll] = useState(null);
  const [defaults, setDefaults] = useState({});
  const [selectedSlug, setSelectedSlug] = useState("italy-monza");
  const [search, setSearch] = useState("");
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
  const filteredTracks = tracks.filter((track) => {
    const query = search.toLowerCase().trim();
    return (
      !query ||
      track.circuit.toLowerCase().includes(query) ||
      track.country.toLowerCase().includes(query) ||
      track.type?.toLowerCase().includes(query)
    );
  });
  const animatedItems = filteredTracks.map((track) => ({
    id: track.slug,
    slug: track.slug,
    title: track.circuit,
    description: track.country,
    meta: track.type,
    flagCode: track.flagCode,
  }));

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
      localStorage.setItem("mysetups_last_updated", String(Date.now()));
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
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <div className="flex flex-col gap-3 lg:col-span-5">
        <h2 className="px-1 text-xs font-semibold text-zinc-300">Seleziona circuito</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cerca circuito o nazione..."
            className="w-full rounded-lg border border-white/10 bg-transparent py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-white/25"
          />
        </div>
        <AnimatedList
          items={animatedItems}
          selectedId={selectedSlug}
          onItemSelect={(item) => setSelectedSlug(item.slug)}
          width="100%"
          maxHeight={620}
          radius={12}
          frame={true}
          displayScrollbar={true}
          enableArrowNavigation={true}
        />
      </div>

      <div className="space-y-3 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">{currentTrack.circuit}</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-2 py-1.5 text-xs text-zinc-400 transition hover:text-white"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !draft}
              className="rounded-md bg-white px-3 py-1.5 text-xs font-bold text-black transition hover:bg-zinc-200 disabled:opacity-50"
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

        <div className="flex gap-3 border-b border-white/10">
          {SETUP_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`border-b-2 px-1 py-2 text-xs font-semibold transition ${
                activeTab === tab.key
                  ? "border-violet-400 text-white"
                  : "border-transparent text-zinc-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {SETUP_SECTIONS.map((section) => (
            <section
              key={section.title}
              className="border-t border-white/10 pt-3 first:border-0 first:pt-0"
            >
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.fields.map((field) => {
                  const value = getParamValue(field.suffix, field.default);
                  return (
                    <div key={field.suffix} className="space-y-0">
                      <div className="flex items-center justify-between gap-4">
                        <label
                          htmlFor={`setup-${field.suffix}`}
                          className="truncate text-[11px] text-zinc-300"
                        >
                          {field.label}
                        </label>
                        <output
                          htmlFor={`setup-${field.suffix}`}
                          className="shrink-0 text-right font-mono text-[11px] font-semibold tabular-nums text-white"
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
                        className="h-2 w-full cursor-pointer accent-violet-400"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
