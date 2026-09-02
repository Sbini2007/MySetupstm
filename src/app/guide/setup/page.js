import AuthGate from "@/components/AuthGate";
import NavBar from "@/components/NavBar";

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <AuthGate requirePremium>
        <main className="px-8 py-32">

          {/* BACKGROUND */}
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.10),transparent_60%)] pointer-events-none" />

          <div className="fixed inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[90px_90px] pointer-events-none" />

          {/* CONTAINER */}
          <div className="max-w-5xl mx-auto">

            {/* CARD */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-8">

              {/* TOP */}
              <div className="flex items-center gap-4 mb-8">

                <div className="bg-purple-600/20 border border-purple-500/30 text-purple-400 px-4 py-1 rounded-full text-sm tracking-widest">
                  AERO
                </div>

                <h1 className="text-4xl font-black">
                  Aero Balancing
                </h1>

              </div>

              {/* CONTENT */}
              <div className="space-y-6 text-2xl leading-relaxed">

                <div>

                  <h2 className="font-black mb-2">
                    ANTERIORE :
                  </h2>

                  <p className="text-gray-300">
                    VALORI ALTI : + CARICO AERODINAMICO + SOVRASTERZO - USURA - VELOCITA' SUL DRITTO
                  </p>

                  <p className="text-gray-300">
                    VALORI BASSI : - CARICO AERODINAMICO + SOTTOSTERZO + USURA + VELOCITA' SUL DRITTO
                  </p>

                </div>

                <div>

                  <h2 className="font-black mb-2">
                    POSTERIORE :
                  </h2>

                  <p className="text-gray-300">
                    VALORI ALTI : + STABILITA' - REATTIVITA' - VELOCITA' SUL DRITTO
                  </p>

                  <p className="text-gray-300">
                    VALORI BASSI : - STABILITA' + REATTIVITA' + VELOCITA' SUL DRITTO
                  </p>

                </div>

              </div>

            </div>

          </div>

        </main>
      </AuthGate>
    </div>
  );
}