"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AuthGate from "@/components/AuthGate";

export default function GuidePage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/guides", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossibile caricare le guide.");
        if (active) setGuides(data.guides || []);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Impossibile caricare le guide.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100">
      <NavBar />
      <AuthGate requireGuideAccess>
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36">
          <div className="mb-10">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
              Manuale Tecnico
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Guide all'Assetto
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl">
              Guide alle sezioni del setup: aerodinamica, trasmissione, geometria e sospensioni, freni e pressione pneumatici.
            </p>
          </div>

          {error ? <p role="alert" className="text-sm text-red-300">{error}</p> : null}
          {!loading && !error ? (
            <nav aria-label="Indice guide">
              <ul className="divide-y divide-white/10">
                {guides.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={`/guide/setup?topic=${encodeURIComponent(guide.slug)}`}
                      className="group flex items-center justify-between gap-6 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    >
                      <span>
                        <span className="block text-base font-semibold text-white transition group-hover:text-violet-200">
                          {guide.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-zinc-400">
                          {guide.description}
                        </span>
                      </span>
                      <ArrowRight size={17} className="shrink-0 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-violet-200" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              {!guides.length ? <p className="text-sm text-zinc-400">Non ci sono ancora guide pubblicate.</p> : null}
            </nav>
          ) : null}
        </main>
      </AuthGate>
      <Footer />
    </div>
  );
}
