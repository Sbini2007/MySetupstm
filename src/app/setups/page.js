import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AuthGate from "@/components/AuthGate";
import Image from "next/image";
import { tracks } from "@/lib/data";

export default function SetupsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AuthGate requirePremium>
          <div className="space-y-8">
            <div className="rounded-4xl border border-white/10 bg-[#111111]/90 p-8 shadow-[0_0_60px_rgba(124,58,237,0.08)]">
              <p className="text-sm uppercase tracking-[0.35em] text-violet-300/80">Premium setups</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Your full setup library</h1>
              <p className="mt-4 max-w-2xl text-white/60">Access curated setups for all circuits, optimized for race pace and tyre management.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tracks.map((track) => (
                <a key={track.slug} href={`/circuiti/${track.slug}`} className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] p-6 text-white transition hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-[0_0_25px_rgba(124,58,237,0.15)]">
                  <Image
                    src={`/flags/${track.flagCode}.svg`}
                    alt={`${track.country} flag`}
                    width={42}
                    height={28}
                    style={{ width: "auto", height: "auto" }}
                    className="h-7 w-11 object-contain"
                  />
                  <h2 className="mt-6 text-xl font-semibold">{track.circuit}</h2>
                  <p className="mt-2 text-sm text-white/50">{track.country}</p>
                </a>
              ))}
            </div>
          </div>
        </AuthGate>
      </main>
      <Footer />
    </div>
  );
}
