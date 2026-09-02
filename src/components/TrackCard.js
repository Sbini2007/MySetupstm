import Image from "next/image";
import Link from "next/link";

export default function TrackCard({ track, locked }) {
  return (
    <Link
      href={locked ? "/login" : `/circuiti/${track.slug}`}
      className="group relative block min-h-52 overflow-hidden rounded-lg border border-white/10 bg-[#101010] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/35 hover:shadow-[0_0_34px_rgba(139,92,246,0.18)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),transparent_42%,rgba(168,85,247,0.08))] opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="grid h-12 w-16 place-items-center rounded-md border border-white/10 bg-white/4 p-2">
          <Image
            src={`/flags/${track.flagCode}.svg`}
            alt={`${track.country} flag`}
            width={42}
            height={28}
            style={{ width: "auto", height: "auto" }}
            className="h-7 w-11 object-contain"
          />
        </div>
        <span className="rounded-md border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/46">
          {track.type || track.country}
        </span>
      </div>

      <div className="relative mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-200/55">
          {track.country}
        </p>
        <h3 className="mt-3 text-2xl font-black leading-tight text-white">
          {track.circuit}
        </h3>
      </div>

      <div className="absolute inset-x-5 bottom-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-bold uppercase tracking-[0.2em] text-white/42">
        <span>{locked ? "Preview" : "Apri setup"}</span>
        <span className="text-violet-300">01</span>
      </div>

      {locked ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/55 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          <span className="rounded-lg border border-violet-400/25 bg-black/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
            Login richiesto
          </span>
        </div>
      ) : null}
    </Link>
  );
}
