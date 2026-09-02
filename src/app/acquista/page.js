import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { pricing } from "@/lib/data";

const features = [
  "Tutti i setup",
  "Guide premium",
  "Note circuito",
  "Supporto Discord",
];

export default function AcquistaPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <section className="rounded-[28px] border border-white/10 bg-[#111111]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-violet-300">
                Acquista
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Un pack unico per tutti gli assetti.
              </h1>
            </div>

            <div className="inline-flex items-center rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-violet-100">
              Premium access
            </div>
          </div>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
            Sblocchi circuiti, guide e supporto premium senza abbonamenti.
            Tutto quello che ti serve per guidare con più sicurezza e ritmo.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.02fr,0.98fr]">
            <div className="rounded-[24px] border border-white/10 bg-[#0d0d0d] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-200/75">
                {pricing.title}
              </p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-black tracking-tight text-white sm:text-6xl">
                  {pricing.price}
                </span>
                <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                  one-time
                </span>
              </div>

              <p className="mt-4 text-base leading-7 text-white/62">
                {pricing.description}
              </p>

              <div className="mt-8 grid gap-3 text-sm text-white/74 sm:grid-cols-2">
                {features.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-violet-500/15 text-[10px] text-violet-200">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-violet-400/20 bg-violet-500/5 p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-200">
                Accesso premium
              </p>

              <h2 className="mt-5 text-3xl font-black leading-tight text-white">
                Entri, scegli circuito, copi l&apos;assetto.
              </h2>

              <p className="mt-4 text-base leading-7 text-white/64">
                Dopo il login trovi la libreria completa con setup per gara e
                qualifica, guide dettagliate e note specifiche per ogni tracciato.
              </p>

              <div className="mt-7 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/15 px-3 py-3 text-sm text-white/76">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] text-emerald-300">
                    •
                  </span>
                  Accesso immediato dopo il pagamento
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/15 px-3 py-3 text-sm text-white/76">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] text-emerald-300">
                    •
                  </span>
                  Supporto premium e aggiornamenti costanti
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/checkout"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-violet-500"
                >
                  Acquista con PayPal
                </a>
                <a
                  href="/circuiti"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.05]"
                >
                  Vedi circuiti
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
