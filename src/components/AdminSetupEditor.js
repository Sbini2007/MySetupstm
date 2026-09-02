"use client";

import { useEffect, useState } from "react";
import { tracks } from "@/lib/data";
import { SETUP_SECTIONS, SETUP_TABS, drivingNotesKeyForTab, tabToPrefix } from "@/lib/setup-sections";
import { Save, ChevronDown } from "lucide-react";

function clampNumericValue(rawValue, field) {
  if (rawValue === "" || rawValue === null || rawValue === undefined) return "";

  const numeric = Number(rawValue);
  if (!Number.isFinite(numeric)) return rawValue;

  const min = typeof field?.min === "number" ? field.min : Number.NEGATIVE_INFINITY;
  const max = typeof field?.max === "number" ? field.max : Number.POSITIVE_INFINITY;
  const clamped = Math.min(Math.max(numeric, min), max);

  if (typeof field?.step === "number" && field.step > 0) {
    const decimals = (String(field.step).split(".")[1] || "").length;
    const rounded = Number(clamped.toFixed(decimals));
    return String(rounded);
  }

  if (Number.isInteger(numeric)) {
    return String(Math.round(clamped));
  }

  return String(Number(clamped.toFixed(2)));
}

function getFlagEmoji(flagCode) {
  if (!flagCode || flagCode.length !== 2) return "🏁";
  const codePoints = flagCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export default function AdminSetupEditor() {
  const [all, setAll] = useState(null);
  const [slug, setSlug] = useState(tracks[0]?.slug || "");
  const [draft, setDraft] = useState(null);
  const [activeTab, setActiveTab] = useState("race");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [togglingSlugs, setTogglingSlugs] = useState(new Set());

  const load = () => {
    fetch("/api/admin/setups")
      .then((r) => r.json())
      .then((d) => setAll(d.setups || {}))
      .catch(() => setAll({}));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!all || !slug) return;
    setDraft({ ...(all[slug] || {}) });
  }, [all, slug]);

  const setKey = (k, v) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/setups", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, setup: draft }),
      });
      if (res.ok) {
        setMsg("Setup salvati sul server.");
        load();
      } else {
        const e = await res.json().catch(() => ({}));
        setMsg(e.error || "Errore salvataggio");
      }
    } catch {
      setMsg("Errore di rete");
    } finally {
      setSaving(false);
    }
  };

  const toggleInProgress = async (e, targetSlug) => {
    e.stopPropagation();
    setTogglingSlugs((prev) => new Set(prev).add(targetSlug));
    try {
      const current = all[targetSlug] || {};
      const updated = { ...current, inProgress: !current.inProgress };
      const res = await fetch("/api/admin/setups", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: targetSlug, setup: updated }),
      });
      if (res.ok) {
        load();
      }
    } catch {
      console.error("Errore toggle inProgress");
    } finally {
      setTogglingSlugs((prev) => {
        const next = new Set(prev);
        next.delete(targetSlug);
        return next;
      });
    }
  };

  if (!all) {
    return <p className="text-white/55">Caricamento setup…</p>;
  }

  // Editing mode
  if (editingSlug && draft) {
    const prefix = tabToPrefix(activeTab);
    const notesKey = drivingNotesKeyForTab(activeTab);
    const track = tracks.find((t) => t.slug === editingSlug);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => setEditingSlug(null)}
              className="mb-2 text-sm text-violet-400 hover:text-violet-300"
            >
              ← Torna alla lista
            </button>
            <h2 className="text-2xl font-bold text-white">
              {track?.country && <span>{getFlagEmoji(track.flagCode)} </span>}
              {track?.circuit}
            </h2>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-bold text-white disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Salvataggio…" : "Salva su server"}
          </button>
        </div>

        {msg ? <p className="text-sm text-violet-200">{msg}</p> : null}

        <p className="text-sm text-white/50">
          Modifica i valori per <strong className="text-white">Gara</strong>, <strong className="text-white">Qualifica</strong> e{" "}
          <strong className="text-white">Bagnato</strong>. I giocatori vedono gli stessi campi nella pagina circuito (con premium).
        </p>

        <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/4 p-1">
          {SETUP_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-bold ${
                activeTab === tab.key ? "bg-violet-500 text-white" : "text-white/60 hover:bg-white/8"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {SETUP_SECTIONS.map((sec) => (
            <div key={sec.title} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="mb-3 text-xs font-black tracking-[0.2em] text-violet-300">{sec.title}</h3>
              <div className="space-y-3">
                {sec.fields.map((f) => {
                  const key = `${prefix}${f.suffix}`;
                  return (
                    <div key={key}>
                      <label className="text-xs text-white/45">{f.label}</label>
                      <input
                        type="number"
                        min={f.min ?? undefined}
                        max={f.max ?? undefined}
                        step={f.step ?? "any"}
                        value={draft[key] ?? ""}
                        onChange={(e) => setKey(key, clampNumericValue(e.target.value, f))}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-violet-400/50"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <label className="text-xs font-black tracking-[0.2em] text-violet-300">NOTE DI GUIDA ({activeTab})</label>
          <textarea
            value={draft[notesKey] ?? ""}
            onChange={(e) => setKey(notesKey, e.target.value)}
            rows={5}
            className="mt-3 w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-violet-400/50"
            placeholder="Testo libero per questo tipo di setup…"
          />
        </div>
      </div>
    );
  }

  // List mode
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-violet-400">ADMIN PANEL</p>
          <h2 className="text-2xl font-bold text-white">SETUPS ({tracks.length} tracks)</h2>
        </div>
      </div>

      <div className="space-y-2">
        {tracks.map((track) => {
          const setup = all[track.slug] || {};
          const hasContent = Object.keys(setup).some((k) => k.startsWith("race_") || k.startsWith("quali_") || k.startsWith("wet_"));
          const isTogglingProgress = togglingSlugs.has(track.slug);

          return (
            <div
              key={track.slug}
              onClick={() => {
                setSlug(track.slug);
                setEditingSlug(track.slug);
              }}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 transition hover:border-violet-500/50 hover:bg-black/50"
            >
              <div className="flex flex-1 items-center gap-3">
                <span className="text-lg">{getFlagEmoji(track.flagCode)}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{track.circuit}</p>
                  <p className="text-xs text-white/50">{track.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {hasContent && (
                  <span className="inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                    HAS SETUP
                  </span>
                )}

                {setup.inProgress && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                    IN PROGRESS
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => toggleInProgress(e, track.slug)}
                  disabled={isTogglingProgress}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition ${
                    setup.inProgress
                      ? "bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
                      : "bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
                  }`}
                >
                  {isTogglingProgress ? "..." : setup.inProgress ? "✓ SEGNALA LAVORO" : "SEGNALA LAVORO"}
                </button>

                <ChevronDown size={18} className="text-white/50" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
