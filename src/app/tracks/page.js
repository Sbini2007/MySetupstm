"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TrackCard from "@/components/TrackCard";
import AuthGate from "@/components/AuthGate";
import { getTracks } from "@/lib/store";

export default function TracksPage() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const sync = () => setTracks(getTracks());
    sync();
    window.addEventListener("mysetups:store", sync);
    return () => window.removeEventListener("mysetups:store", sync);
  }, []);

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100">
      <NavBar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            24 Circuiti F1 26
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Configurazioni verificate per Gara, Qualifica, Bagnato, Asciutto e carichi aerodinamici dedicati.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track, idx) => (
            <TrackCard key={track.slug} track={track} locked={false} index={idx} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
