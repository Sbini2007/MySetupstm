"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthGate from "@/components/AuthGate";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function GuideDetailPage() {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const topic = new URLSearchParams(window.location.search).get("topic");
    if (!topic) {
      setError("Seleziona una guida dall'indice.");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    fetch("/api/guides", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossibile caricare la guida.");
        const selected = (data.guides || []).find((item) => item.slug === topic);
        if (!selected) throw new Error("La guida richiesta non esiste.");
        if (active) setGuide(selected);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Impossibile caricare la guida.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#07070a] text-zinc-100">
      <div>
        <NavBar />
        <AuthGate requireGuideAccess>
          <main className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36">
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Indice guide
            </Link>

            {loading ? <p className="mt-10 text-sm text-zinc-400">Caricamento guida…</p> : null}
            {error ? <p role="alert" className="mt-10 text-sm text-red-300">{error}</p> : null}
            {guide ? (
              <article className="mt-10">
                <p className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
                  Guida tecnica
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {guide.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-300">
                  {guide.description}
                </p>
                {guide.content ? (
                  <div className="mt-8 whitespace-pre-wrap text-sm leading-7 text-zinc-300 sm:text-base">
                    {guide.content}
                  </div>
                ) : null}
              </article>
            ) : null}
          </main>
        </AuthGate>
      </div>
      <Footer />
    </div>
  );
}
