"use client";

import { Star } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { detailedReviews } from "@/lib/reviews";

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100">
      <NavBar />

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-16 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
            Feedback Community
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Recensioni dai Piloti
          </h1>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-zinc-400">
            Opinioni e commenti di chi utilizza i nostri assetti in pista e nei campionati.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {detailedReviews.map((rev, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0c0c10] p-6"
            >
              <div>
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="mt-6 border-t border-white/[0.05] pt-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">{rev.driver}</span>
                  <span className="text-[11px] text-zinc-500">{rev.role}</span>
                </div>
                <span className="text-[11px] text-zinc-500">{rev.track}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
