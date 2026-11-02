"use client";

import Image from "next/image";
import Link from "next/link";
import logoImg from "@/assets/images/logo.png";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-violet-400/[0.12] bg-[#08090f] text-zinc-400">
      <div className="mx-auto max-w-5xl -translate-y-1 px-4 py-12 sm:-translate-y-1 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-violet-400/[0.1]">
          <div>
            <div className="flex items-center">
              <div className="relative -ml-2 h-20 w-20 translate-y-3 sm:-ml-3 sm:h-24 sm:w-24 sm:translate-y-4">
                <Image
                  src={logoImg}
                  alt="MySetups"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <p className="mt-2.5 text-xs text-zinc-500 max-w-sm leading-relaxed">
              Assetti F1 26 e assistenza tecnica per migliorare il passo, gestire le gomme e trovare il giusto bilanciamento in ogni condizione.
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
