"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  Check,
  ChevronRight,
  Circle,
  Download,
  Headphones,
  Quote,
  Settings,
  Shield,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import { useLanguage } from "@/lib/i18n";
import { pricing, reviews } from "@/lib/data";

export default function Home() {
  const { t } = useLanguage();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const featureCards = [
    {
      icon: Trophy,
      title: t("esportsPerformance"),
      text: t("esportsPerformanceDesc"),
    },
    {
      icon: Headphones,
      title: t("premiumSupport"),
      text: t("premiumSupportDesc"),
    },
    {
      icon: BookOpen,
      title: t("setupGuides"),
      text: t("setupGuidesDesc"),
    },
  ];
  const [latestTrack, setLatestTrack] = useState(null);

  useEffect(() => {
    const loadLatest = async () => {
      try {
        const response = await fetch("/api/setups/latest", { cache: "no-store" });
        const data = await response.json();
        setLatestTrack(data?.track || null);
      } catch {
        setLatestTrack(null);
      }
    };

    loadLatest();
    const timer = setInterval(loadLatest, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <NavBar />

      <main>
          <section className="relative isolate flex min-h-screen items-center justify-center px-4 pt-24 text-center">
            <div className="home-depth-grid absolute inset-0 -z-30" />
            <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),rgba(12,7,20,0.5)_24%,rgba(5,5,5,0.96)_62%)]" />
            <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-linear-to-b from-black via-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-black via-black/80 to-transparent" />

            <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
              <div className="inline-flex items-center rounded-full border border-violet-400/35 bg-violet-500/10 px-5 py-2 text-sm font-bold uppercase tracking-tight text-violet-300 shadow-[0_0_35px_rgba(139,92,246,0.16)]">
                F126 SETUPS
              </div>

              <p className="mt-10 text-sm font-medium uppercase tracking-[0.55em] text-white/52 sm:text-base">
                {t("welcome")}
              </p>

              <h1 className="mt-6 text-[clamp(4.5rem,12vw,10rem)] font-black leading-none tracking-[-0.03em] text-white">
                <span className="bg-[linear-gradient(180deg,#b26cff,#8b5cf6)] bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(139,92,246,0.35)]">
                  My
                </span>
                <span>Setups</span>
                <sup className="ml-2 align-super text-[0.14em] font-black tracking-normal text-violet-400">
                  TM
                </sup>
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-8 text-white/58 sm:text-2xl">
                {t("heroSubtitle")}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {!isAuthenticated ? (
                  <Link
                    href="/login"
                    className="inline-flex min-w-44 items-center justify-center gap-3 rounded-xl bg-violet-500 px-7 py-4 text-base font-black text-white shadow-[0_0_46px_rgba(139,92,246,0.38)] transition hover:-translate-y-0.5 hover:bg-violet-400"
                  >
                    {t("loginNow")}
                    <ChevronRight size={18} />
                  </Link>
                ) : null}
                <Link
                  href="/tracks"
                  className="inline-flex min-w-44 items-center justify-center rounded-xl border border-white/12 bg-black/25 px-7 py-4 text-base font-black text-white transition hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-white/4"
                >
                  {t("viewCircuits")}
                </Link>
              </div>

              <div className="mt-10 w-full max-w-2xl rounded-2xl border border-violet-500/25 bg-[linear-gradient(135deg,rgba(139,92,246,0.1),rgba(255,255,255,0.02))] p-5 shadow-[0_0_45px_rgba(139,92,246,0.14)] backdrop-blur-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full border border-violet-400/30 bg-violet-500/10 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
                      <Zap size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-200/75">{t("lastTrackUpdated")}</p>
                      <h3 className="mt-1 text-xl font-black text-white">{latestTrack?.circuit || "Loading…"}</h3>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
                  <span>{t("updated")} {latestTrack ? new Date(latestTrack.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                  {latestTrack?.updatedAt ? (
                    <span className="text-violet-200">{new Date(latestTrack.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                  ) : null}
                </div>
              </div>

              <div className="mt-20 flex w-full max-w-xl items-center justify-center gap-8 text-xs font-medium uppercase tracking-[0.28em] text-white/16 sm:gap-12">
                <span>Aero</span>
                <span className="h-px w-16 bg-violet-500/35" />
                <span>Grip</span>
                <span className="h-px w-16 bg-violet-500/35" />
                <span>Pace</span>
                <span className="h-px w-16 bg-violet-500/35" />
                <span>Win</span>
              </div>
            </div>
          </section>

          <section id="features" className="relative scroll-mt-28 border-t border-white/3 bg-[#070707] px-4 py-28 sm:px-6 lg:px-8">
            <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-violet-950/10 to-transparent" />
            <div className="relative mx-auto max-w-7xl">
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-[0.45em] text-violet-400">
                  {t("features")}
                </p>
                <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">
                  {t("why")}<sup className="text-base text-violet-300">TM</sup>
                </h2>
              </div>

              <div className="mt-16 grid gap-6 md:grid-cols-3">
                {featureCards.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <article
                      key={feature.title}
                      className="rounded-xl border border-white/10 bg-white/4.5 p-7 shadow-[0_0_50px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/6"
                    >
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/16 text-violet-300">
                        <Icon size={21} />
                      </div>
                      <h3 className="mt-6 text-lg font-black uppercase tracking-wide text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-3 leading-7 text-white/58">{feature.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="reviews" className="scroll-mt-28 bg-[#080808] px-4 py-28 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-[0.45em] text-violet-400">
                  {t("testimonials")}
                </p>
                <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">
                  {t("driverReviews")}
                </h2>
              </div>

              <div className="mt-16 grid gap-6 md:grid-cols-2">
                {reviews.map((review) => (
                  <figure
                    key={review}
                    className="rounded-xl border border-white/10 bg-white/4 p-8 shadow-[0_0_50px_rgba(0,0,0,0.18)]"
                  >
                    <Quote className="text-violet-500/35" size={34} />
                    <blockquote className="mt-4 text-base font-semibold italic leading-8 text-white/88">
                      "{review}"
                    </blockquote>
                    <figcaption className="mt-7 flex gap-1 text-violet-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={16} fill="currentColor" />
                      ))}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>


          <section id="support" className="scroll-mt-28 bg-[#050505] px-4 pb-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-2xl border border-violet-500/25 bg-[linear-gradient(135deg,rgba(139,92,246,0.11),rgba(255,255,255,0.035),rgba(255,255,255,0.02))] px-6 py-16 text-center shadow-[0_0_90px_rgba(139,92,246,0.1)]">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-violet-500/16 text-violet-300">
                <Headphones size={25} />
              </div>
              <h2 className="mt-6 text-3xl font-black uppercase tracking-tight">
                {t("needHelp")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/58">
                {t("helpCopy")}
              </p>
              <a
                href="89/YzVN3ncCwR"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-violet-500 px-7 py-3 font-black text-white transition hover:bg-violet-400"
              >
                {t("openDiscord")}
              </a>
            </div>
          </section>
        </main>
      </div>
  );
}
