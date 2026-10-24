"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/client-auth";
import { ArrowLeft, Sparkles, Trophy, Zap, Sliders } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SetupDisplay from "@/components/SetupDisplay";
import { tracks } from "@/lib/data";
import { generateFlatSetup, trackProfiles } from "@/lib/default-setups";
import { safeFetchJson } from "@/lib/safe-json";

export default function CircuitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.country || params.slug;
  const track = tracks.find((item) => item.slug === slug || item.country.toLowerCase() === String(slug).toLowerCase()) || tracks[0];
  const trackIndex = tracks.findIndex((item) => item.slug === track.slug) + 1;
  const profile = trackProfiles[track.slug] || trackProfiles["italy-monza"];

  const [setup, setSetup] = useState(() => generateFlatSetup(track?.slug || "italy-monza"));
  const [isAuthorized, setIsAuthorized] = useState(true);

  const loadSetup = useCallback(async () => {
    if (!slug) return;
    const data = await safeFetchJson(`/api/setups/${slug}`, { cache: "no-store" });
    if (data?.setup) {
      setSetup(data.setup);
    }
  }, [slug]);

  useEffect(() => {
    const instant = generateFlatSetup(track?.slug);
    if (instant) setSetup(instant);
    loadSetup();
  }, [loadSetup, track?.slug]);

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col justify-between">
      <div>
        <NavBar />

        <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
          {/* Back Navigation Bar */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/setups"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft size={14} />
              <span>Tutti i Setup</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">
                GP {trackIndex} di 24
              </span>
              <span className="rounded border border-white/15 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[11px] font-bold text-zinc-300">
                F1 26 SPEC
              </span>
            </div>
          </div>

          {/* Track Header Card */}
          <div className="rounded-2xl border border-white/15 bg-[#0c0d14] p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-20 shrink-0 place-items-center rounded-xl border border-white/15 bg-black/40 p-2">
                  <Image
                    src={`/flags/${track.flagCode}.svg`}
                    alt={`${track.country} flag`}
                    width={48}
                    height={32}
                    className="h-8 w-12 rounded-[2px] object-cover ring-1 ring-white/10"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                    <span className="text-zinc-300 font-bold">Round {String(trackIndex).padStart(2, "0")}</span>
                    <span>·</span>
                    <span>{track.country.toUpperCase()}</span>
                    <span>·</span>
                    <span className="text-zinc-500">{track.type}</span>
                  </div>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {track.circuit}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-4 self-start sm:self-auto border-t sm:border-t-0 border-white/[0.06] pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Configurazione</span>
                  <span className="font-mono text-sm font-semibold text-zinc-300">
                    6 Variazioni
                  </span>
                </div>
                <div className="text-left sm:text-right border-l border-white/[0.08] pl-4">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Carico Aero</span>
                  <span className="font-mono text-sm font-semibold text-zinc-300">
                    {profile.downforce || "Bilanciato"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Setup Display Section with RBAC */}
          <section className="mt-8">
            <SetupDisplay
              setup={setup}
              isAuthorized={isAuthorized}
              onBack={() => router.push("/setups")}
              trackName={`${track.country} (${track.circuit})`}
              slug={track.slug}
            />
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
