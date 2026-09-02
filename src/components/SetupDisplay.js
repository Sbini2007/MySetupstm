"use client";

import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, Zap, CloudRain } from "lucide-react";
import { SETUP_SECTIONS, SETUP_TABS, drivingNotesKeyForTab, tabToPrefix } from "@/lib/setup-sections";

const SetupRow = memo(({ label, value, unit }) => (
  <div className="flex items-center justify-between border-b border-white/5 py-3 last:border-0">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="text-sm font-bold tracking-wide text-purple-400">
      {value !== undefined && value !== null && String(value).trim() !== "" ? `${value}${unit || ""}` : "—"}
    </span>
  </div>
));

const ICONS = { race: Flag, quali: Zap, wet: CloudRain };

export function formatUpdatedStamp(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function SetupDisplay({ setup, onBack }) {
  const [activeTab, setActiveTab] = useState("race");

  if (!setup) return null;

  const prefix = tabToPrefix(activeTab);
  const p = (suffix) => setup[`${prefix}${suffix}`];

  const sections = SETUP_SECTIONS.map((sec) => ({
    title: sec.title,
    items: sec.fields.map((f) => ({
      label: f.label,
      value: p(f.suffix),
      unit: f.unit,
    })),
  }));

  const notesKey = drivingNotesKeyForTab(activeTab);
  const notes = setup[notesKey] || (activeTab === "race" ? setup.driving_notes : null);

  return (
    <div className="space-y-6">
      {onBack ? (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-100 shadow-[0_0_18px_rgba(139,92,246,0.2)] transition hover:border-violet-300/60 hover:bg-violet-500/20 hover:text-white"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-base">
              ←
            </span>
            Torna indietro
          </button>
        </div>
      ) : null}

      <div className="rounded-2xl border border-violet-500/25 bg-[linear-gradient(135deg,rgba(139,92,246,0.12),rgba(255,255,255,0.02))] p-4 shadow-[0_0_30px_rgba(139,92,246,0.12)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-200/80">Last Update</p>
            <p className="mt-2 text-lg font-bold text-white">{formatUpdatedStamp(setup.updatedAt)}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.2)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </div>
        </div>
      </div>

      <div className="flex gap-2 rounded-2xl border border-white/5 bg-[#111111] p-1">
        {SETUP_TABS.map(({ key, label }) => {
          const Icon = ICONS[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition duration-200 ${
                activeTab === key ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{key === "race" ? "Gara" : key === "quali" ? "Quali" : "Wet"}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.22 }}
          className="space-y-4"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-2xl border border-white/5 bg-[#111111] p-5"
            >
              <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-purple-400">{section.title}</h3>
              <div>
                {section.items.map((item, ii) => (
                  <SetupRow key={`${section.title}-${ii}`} {...item} />
                ))}
              </div>
            </motion.div>
          ))}

          {notes ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/5 bg-[#111111] p-5"
            >
              <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-purple-400">NOTE DI GUIDA</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{notes}</p>
            </motion.div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
