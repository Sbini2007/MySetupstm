"use client";

import Image from "next/image";
import Link from "next/link";
import logoImg from "@/assets/images/logo.png";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-violet-400/[0.12] bg-[#08090f] text-zinc-400">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-violet-400/[0.1]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="relative h-7 w-7">
                <Image
                  src={logoImg}
                  alt="MySetups"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-sm font-extrabold text-white tracking-tight">MYSETUPS</span>
                <span className="text-[8px] font-mono tracking-widest text-violet-300 uppercase">F1 26 Sim Engineering</span>
              </div>
            </div>
            <p className="mt-2.5 text-xs text-zinc-500 max-w-sm leading-relaxed">
              Assetti e telemetrie sim racing per Formula 1 2026. Calibrati per stabilità, rotazione e consistenza passo gara su volante e controller.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <Link href="/setups" className="hover:text-violet-300 transition">
              Setup
            </Link>
            <Link href="/guide" className="hover:text-violet-300 transition">
              Guide
            </Link>
            <a
              href="https://discord.gg/YzVN3ncCwR"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-violet-300 transition text-zinc-400"
            >
              <span>Discord</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© 2026 MySetups. F1 2026 Season Validated.</p>
        </div>
      </div>
    </footer>
  );
}
