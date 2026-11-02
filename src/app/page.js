"use client";

import { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CarSetupDiagram from "@/components/CarSetupDiagram";
import TextType from "@/components/TextType";
import { safeFetchJson } from "@/lib/safe-json";
import { formatRelativeTime } from "@/lib/relative-time";
import { detailedReviews } from "@/lib/reviews";

export default function HomePage() {
  const [latestUpdate, setLatestUpdate] = useState(null);
  // Refresh latest setup on load and after admin saves in another tab.
  useEffect(() => {
    const refreshLatestUpdate = () => {
      safeFetchJson("/api/setups/latest", { cache: "no-store" }).then((data) => {
        if (data?.track) setLatestUpdate(data.track);
      });
    };
    const handleStorage = (event) => {
      if (event.key === "mysetups_last_updated") refreshLatestUpdate();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshLatestUpdate();
    };

    refreshLatestUpdate();
    window.addEventListener("mysetups_setup_updated", refreshLatestUpdate);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("mysetups_setup_updated", refreshLatestUpdate);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const formattedUpdateDate = useMemo(() => {
    const relativeTime = formatRelativeTime(latestUpdate?.updatedAt);
    return relativeTime ? `Ultimo aggiornamento ${relativeTime}` : "Ultimo aggiornamento recente";
  }, [latestUpdate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0b18] via-[#07070a] to-[#07070a] text-zinc-100 flex flex-col justify-between selection:bg-violet-500/30 selection:text-white">
      <div>
        <NavBar />

        {/* ================= HERO SECTION ================= */}
        <section className="relative mx-auto max-w-5xl overflow-hidden px-4 pt-36 pb-20 text-center sm:px-6 sm:pt-40 sm:pb-24 lg:px-8">
          {/* Hero Background Atmosphere */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <Image
              src="/assets/aistudio/image_e54ac127.png"
              alt=""
              fill
              priority
              className="object-cover object-center opacity-30 select-none scale-105"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(82,39,255,0.2),transparent_55%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b18]/45 via-[#07070a]/85 to-[#07070a]" />
          </div>

          <div className="relative mx-auto flex flex-col items-center">
            <div className="relative mx-auto flex w-full flex-col items-center">
              <TextType />
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                Assetti F1 26 e assistenza tecnica per migliorare il passo, gestire le gomme e trovare il giusto bilanciamento in ogni condizione.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/setups"
                  className="home-explore-button inline-flex items-center gap-2 rounded-none bg-[#8b5cf6] px-6 py-3 text-xs font-bold text-white shadow-md shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a12] sm:text-sm"
                >
                  <span>Esplora i Setup</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
              <CarSetupDiagram />
            </div>
          </div>
        </section>

        <section aria-label="Ultimo setup aggiornato" className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="py-2">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {latestUpdate ? (
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                      <Image
                        src={`/flags/${latestUpdate.flagCode}.svg`}
                        alt=""
                        width={48}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold text-white">{latestUpdate.circuit}</h2>
                      <p className="mt-1 text-xs font-medium text-zinc-400">{latestUpdate.country}</p>
                      <p className="mt-1 text-xs text-zinc-500">{formattedUpdateDate}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400">Scopri gli assetti disponibili per preparare il prossimo weekend di gara.</p>
                )}
              </div>
              <Link
                href="/setups"
                className="home-setups-cta inline-flex w-fit shrink-0 items-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <span className="home-setups-cta__label">Tutti i setup</span>
                <ArrowRight className="home-setups-cta__icon" size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <div className="relative w-full border-t border-white/[0.06] bg-gradient-to-b from-[#0d0b18] via-[#090a12] to-[#090a12]">

        <div className="flex flex-col">
        <section aria-labelledby="categories-heading" className="order-2 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <h2 id="categories-heading" className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Tutto quello che ti serve per la pista
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Setup e guide per capire e perfezionare il tuo assetto in setup competitivi e guide su come adattare l'assetto al proprio stile di guida.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: "Setup", description: "Assetti competitivi aggiornati settimanalmente.", href: "/setups" },
              { title: "Guide", description: "Consigli per migliorare ogni assetto al proprio stile di guida.", href: "/guide" },
            ].map(({ title, description, href }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-xl border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-violet-300/40 hover:bg-violet-500/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-violet-200">
                  Scopri di più <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
        </div>

        <section aria-labelledby="reviews-heading" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-7">
            <h2 id="reviews-heading" className="text-xl font-black tracking-tight text-white sm:text-2xl">
              Feedback dei Piloti
            </h2>
          </div>

          <div className="grid auto-cols-[minmax(260px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-3 xl:auto-cols-auto xl:grid-flow-row xl:grid-cols-4 xl:overflow-visible">
            {detailedReviews.map((review) => (
              <article
                key={review.driver}
                onMouseMove={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
                  event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
                }}
                className="group relative flex min-h-64 flex-col overflow-hidden rounded-lg border border-white/[0.1] bg-[#0c0d15] p-5 transition-colors duration-300 hover:border-violet-300/40"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(220px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(139, 92, 246, 0.2), transparent 78%)",
                  }}
                />
                <div className="relative flex h-full flex-1 flex-col">
                  <Image
                    src="/assets/review-avatar.png"
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                    aria-hidden="true"
                  />
                  <p className="mt-5 flex-1 text-xs leading-relaxed text-zinc-300 sm:text-[13px]">
                    “{review.text}”
                  </p>
                  <div aria-hidden="true" className="mt-5 border-t border-white/[0.08]" />
                  <p className="mt-3 text-xs font-semibold text-violet-300">{review.driver}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="community-heading" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 id="community-heading" className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                Entra nel Discord di MySetups
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Confrontati con gli altri piloti, ricevi gli aggiornamenti sui nuovi assetti e chiedi supporto alla community.
              </p>
            </div>

            <a
              href="https://discord.gg/YzVN3ncCwR"
              target="_blank"
              rel="noreferrer"
              aria-label="Partecipa alla community MySetups su Discord"
              className="home-setups-cta home-discord-cta inline-flex w-fit shrink-0 items-center rounded-none bg-transparent px-4 py-3 text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aab0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a12]"
            >
              <span className="home-setups-cta__label">Partecipa</span>
              <ArrowRight className="home-setups-cta__icon" size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}