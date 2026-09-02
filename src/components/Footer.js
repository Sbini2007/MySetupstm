"use client";

"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Footer() {
  const { data: session } = useSession();
  const premium = Boolean(session?.user?.premium || session?.user?.admin);

  return (
    <footer className="border-t border-white/10 bg-[#070707] px-4 py-10 text-white/64 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {premium ? (
          <div className="grid gap-8 rounded-lg border border-white/10 bg-white/[0.035] p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-violet-300">
                Serve supporto sull'assetto?
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Entra nel Discord se vuoi più informazioni.
              </h2>
            </div>
            <a
              href="https://discord.gg/YzVN3ncCwR"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-white transition hover:bg-violet-500"
            >
              Join Discord
            </a>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 MySetups. Premium F126 setup service.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <Link href="/circuiti" className="transition hover:text-white">Circuiti</Link>
            <Link href="/acquista" className="transition hover:text-white">Acquista</Link>
            {premium ? <Link href="/support" className="transition hover:text-white">Supporto</Link> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
