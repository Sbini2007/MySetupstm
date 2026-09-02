"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AuthGate from "@/components/AuthGate";
import { getGuides } from "@/lib/store";
import { useLanguage } from "@/lib/i18n";

export default function GuidePage() {
  const [guides, setGuides] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const sync = () => setGuides(getGuides());
    sync();
    window.addEventListener("mysetups:store", sync);
    return () => window.removeEventListener("mysetups:store", sync);
  }, []);

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <NavBar />
      <AuthGate requirePremium>
        <main className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <section className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300">
              Premium guides
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
              {t("guides")}
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/62">
              Guide rapide per leggere il comportamento della macchina e capire
              dove intervenire tra aero, gomme, sospensioni e differenziale.
            </p>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.title}
                href="/guide/setup"
                className="group rounded-lg border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-200/60">
                  Setup guide
                </p>
                <h2 className="mt-4 text-2xl font-black text-white">
                  {guide.title}
                </h2>
                <p className="mt-3 leading-7 text-white/62">{guide.description}</p>
                <span className="mt-6 inline-flex text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                  Apri guida
                </span>
              </Link>
            ))}
          </section>
        </main>
      </AuthGate>
      <Footer />
    </div>
  );
}
