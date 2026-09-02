"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TrackCard from "@/components/TrackCard";
import AuthGate from "@/components/AuthGate";
import { getTracks } from "@/lib/store";
import { useLanguage } from "@/lib/i18n";

export default function TracksPage() {
  const [tracks, setTracks] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const sync = () => setTracks(getTracks());
    sync();
    window.addEventListener("mysetups:store", sync);
    return () => window.removeEventListener("mysetups:store", sync);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />
      <AuthGate requirePremium>
        <main className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <section className="mb-12">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-violet-300/80">Track library</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{t("circuits")} Formula 1 25</h1>
            <p className="max-w-2xl text-white/60">Sfoglia le piste e sblocca i setup premium dopo il login. Le modifiche admin compaiono qui subito.</p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tracks.map((track) => (
            <TrackCard key={track.slug} track={track} locked={false} />
          ))}
        </div>
        </main>
      </AuthGate>
      <Footer />
    </div>
  );
}
