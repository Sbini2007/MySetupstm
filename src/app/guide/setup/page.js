"use client";

import { useState } from "react";
import Link from "next/link";
import { Wind, Sliders, Gauge, ShieldAlert, ArrowLeft } from "lucide-react";
import AuthGate from "@/components/AuthGate";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const tabs = [
  { id: "aero", label: "Aerodinamica", icon: Wind },
  { id: "suspension", label: "Sospensioni & Barre", icon: Sliders },
  { id: "diff", label: "Differenziale & Freni", icon: Gauge },
  { id: "troubleshoot", label: "Diagnosi Guida", icon: ShieldAlert },
];

export default function SetupGuidePage() {
  const [activeTab, setActiveTab] = useState("aero");

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100">
      <NavBar />
      <AuthGate requirePremium>
        <main className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6">
          <Link
            href="/guide"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft size={13} />
            <span>Indice guide</span>
          </Link>

          <div className="mt-4 mb-8">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
              Guida Tecnica
            </span>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Regolazione e Messa a Punto
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Principi fisici ed effetti pratici di ogni parametro di setup in pista.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 overflow-x-auto rounded-lg border border-white/[0.08] bg-[#0c0c10] p-1 text-xs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 px-3 font-medium whitespace-nowrap transition ${
                    isActive
                      ? "bg-white/[0.12] text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Sections */}
          <div className="mt-6 space-y-4">
            {activeTab === "aero" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/[0.08] bg-[#0c0c10] p-6">
                  <h2 className="text-base font-semibold text-white">Ala Anteriore (Front Wing)</h2>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    Determina l'inserimento a media ed alta velocità. Più ala anteriore equivale a un avantreno preciso e rapido, con maggior usura gomma anteriore.
                  </p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
                      <span className="font-semibold text-white block">Valori Alti (+)</span>
                      <p className="mt-1 text-zinc-400">Massima reattività nei curvoni veloci; minore velocità massima.</p>
                    </div>
                    <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
                      <span className="font-semibold text-white block">Valori Bassi (-)</span>
                      <p className="mt-1 text-zinc-400">Minore resistenza aerodinamica sui rettilinei; rischio sottosterzo ad alta velocità.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#0c0c10] p-6">
                  <h2 className="text-base font-semibold text-white">Ala Posteriore (Rear Wing)</h2>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    Garantisce aderenza al retrotreno in accelerazione e nelle curve veloci.
                  </p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
                      <span className="font-semibold text-white block">Valori Alti (+)</span>
                      <p className="mt-1 text-zinc-400">Retrotreno incollato in uscita di curva; meno pattinamento sul gas.</p>
                    </div>
                    <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
                      <span className="font-semibold text-white block">Valori Bassi (-)</span>
                      <p className="mt-1 text-zinc-400">Top speed elevata per piste veloci come Monza e Spa; retrotreno più nervoso.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "suspension" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/[0.08] bg-[#0c0c10] p-6">
                  <h2 className="text-base font-semibold text-white">Barre Antirollio (ARB) & Sospensioni</h2>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    Regolano il trasferimento di carico laterale e la capacità dell'auto di assorbire cordoli e asperità.
                  </p>
                  <div className="mt-4 space-y-2 text-xs text-zinc-300">
                    <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
                      <strong className="text-white block">Barra Anteriore Rigida:</strong>
                      <span>Reattività immediata nei cambi di direzione secchi (chicane), ma tende a produrre sottosterzo a centro curva.</span>
                    </div>
                    <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
                      <strong className="text-white block">Barra Posteriore Morbida:</strong>
                      <span>Aumenta la trazione meccanica in uscita, aiutando a scaricare a terra la potenza senza pattinare.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "diff" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/[0.08] bg-[#0c0c10] p-6">
                  <h2 className="text-base font-semibold text-white">Differenziale On & Off Throttle</h2>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    Regola la differenza di velocità di rotazione tra le due ruote posteriori motrici.
                  </p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
                      <span className="font-semibold text-white block">On-Throttle (In Accelerazione)</span>
                      <p className="mt-1 text-zinc-400">Valori 50-55% aumentano la rotazione in uscita; valori più alti massimizzano la spinta sui dritti.</p>
                    </div>
                    <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
                      <span className="font-semibold text-white block">Off-Throttle (In Ingresso Curva)</span>
                      <p className="mt-1 text-zinc-400">Valori bassi (50%) favoriscono l'inserimento verso il punto di corda quando si rilasciano i freni.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "troubleshoot" && (
              <div className="rounded-xl border border-white/[0.08] bg-[#0c0c10] p-6">
                <h2 className="text-base font-semibold text-white">Risoluzione Rapida Problemi di Guida</h2>
                <div className="mt-4 divide-y divide-white/[0.06] text-xs">
                  <div className="py-3">
                    <span className="font-semibold text-white block">Sottosterzo nei tornanti lenti:</span>
                    <p className="mt-0.5 text-zinc-400">Ammorbidisci la barra antirollio anteriore di 1-2 click o abbassa l'Off-Throttle del differenziale.</p>
                  </div>
                  <div className="py-3">
                    <span className="font-semibold text-white block">Perdita di trazione sul gas in uscita:</span>
                    <p className="mt-0.5 text-zinc-400">Abbassa la pressione delle gomme posteriori (0.2-0.4 psi) e ammorbidisci le sospensioni posteriori.</p>
                  </div>
                  <div className="py-3">
                    <span className="font-semibold text-white block">L'auto salta e perde aderenza sui cordoli alti:</span>
                    <p className="mt-0.5 text-zinc-400">Aumenta l'altezza da terra anteriore e posteriore di 2-3 mm.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </AuthGate>
      <Footer />
    </div>
  );
}