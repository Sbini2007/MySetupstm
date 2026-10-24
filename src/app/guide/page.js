"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wind, Gauge, Sliders, Activity, Shield, Flame, ArrowUpRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AuthGate from "@/components/AuthGate";
import { getGuides } from "@/lib/store";

const guideIcons = [Wind, Gauge, Sliders, Activity, Shield, Flame];

export default function GuidePage() {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    const sync = () => setGuides(getGuides());
    sync();
    window.addEventListener("mysetups:store", sync);
    return () => window.removeEventListener("mysetups:store", sync);
  }, []);

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100">
      <NavBar />
      <AuthGate requirePremium>
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6">
          <div className="mb-8">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
              Manuale Tecnico
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Guide all'Assetto
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl">
              Spiegazioni chiare e concise su come regolare aerodinamica, sospensioni, pressioni gomme e differenziali in pista.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, idx) => {
              const Icon = guideIcons[idx % guideIcons.length];
              return (
                <Link
                  key={guide.title}
                  href={`/guide/setup?topic=${encodeURIComponent(guide.title)}`}
                  className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0c0c10] p-5 transition hover:border-white/20 hover:bg-[#101015]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
                        <Icon size={16} />
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">0{idx + 1}</span>
                    </div>

                    <h2 className="mt-4 text-base font-semibold text-white group-hover:text-zinc-200 transition">
                      {guide.title}
                    </h2>
                    <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                      {guide.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-end border-t border-white/[0.05] pt-3 text-xs">
                    <span className="inline-flex items-center gap-1 font-medium text-zinc-400 group-hover:text-white transition">
                      <span>Leggi</span>
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </AuthGate>
      <Footer />
    </div>
  );
}
