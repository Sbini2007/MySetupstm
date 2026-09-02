"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Download, Globe2, LogOut, Shield, UserRound } from "lucide-react";
import { languages, useLanguage } from "@/lib/i18n";

export default function NavBar() {
  const { data: session, status } = useSession();
  const [languageOpen, setLanguageOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const activeLanguage = languages.find((item) => item.code === language) || languages[1];
  const user = session?.user;
  const admin = Boolean(user?.admin);
  const premium = Boolean(user?.premium || admin);
  const loading = status === "loading";
  const links = [
    { href: "/circuiti", label: t("circuits") },
    { href: "/acquista", label: t("acquista") },
    ...(premium
      ? [
          { href: "/guide", label: t("guides") },
          { href: "/support", label: t("support") },
        ]
      : []),
  ];

  useEffect(() => {
    if (!languageOpen) return;
    const close = () => setLanguageOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [languageOpen]);

  return (
    <header className="sticky top-0 z-[999] flex w-full justify-center px-4 pt-4 sm:pt-5">
      <div className="flex w-full max-w-6xl items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[#0b0b0f]/60 px-5 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)] ring-1 ring-violet-400/5 backdrop-blur-md">
        <Link href="/" className="group inline-flex min-w-max items-center gap-3">
          <Image src="/logo.png" alt="MySetups" width={40} height={40} className="h-10 w-10 rounded-2xl shadow-[0_0_24px_rgba(139,92,246,0.2)] transition group-hover:shadow-[0_0_28px_rgba(168,85,247,0.35)]" />
          <span>
            <span className="block text-sm font-black tracking-tight text-white">
              <span className="text-violet-300">My</span>Setups
              <sup className="ml-0.5 text-[8px] text-violet-300">TM</sup>
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/48 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 text-sm font-medium text-white/50 md:flex">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLanguageOpen((current) => !current);
            }}
            className="relative inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-1 transition hover:border-violet-300/50 hover:text-white"
          >
            <Globe2 size={16} />
            {activeLanguage.short} {activeLanguage.label}
          </button>
          {languageOpen ? (
            <div
              className="absolute right-72 top-[4.55rem] z-[60] w-44 overflow-hidden rounded-xl border border-white/10 bg-[#151515] py-2 text-sm shadow-[0_20px_70px_rgba(0,0,0,0.48)]"
              onClick={(e) => e.stopPropagation()}
            >
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setLanguageOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left font-semibold transition hover:bg-violet-500/12 hover:text-white ${
                    item.code === language ? "bg-violet-500/14 text-violet-200" : "text-white/75"
                  }`}
                >
                  <span className="text-xs text-white/70">{item.short}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
          <a href="https://discord.gg/YzVN3ncCwR" target="_blank" rel="noreferrer" className="transition hover:text-white">
            Discord
          </a>
          {loading ? (
            <span className="text-white/35">…</span>
          ) : user ? (
            <>
              <Link
                href="/account"
                className="inline-flex max-w-[11rem] items-center gap-2 truncate font-semibold text-violet-300 transition hover:text-violet-100"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/15" />
                ) : (
                  <UserRound size={16} className="shrink-0" />
                )}
                <span className="truncate">{user.premium ? "Premium" : user.name || "Account"}</span>
              </Link>
              {admin ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-500/18"
                >
                  <Shield size={14} />
                  Staff
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <LogOut size={16} />
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-semibold text-white transition hover:border-violet-400/40 hover:bg-white/15"
              >
                <UserRound size={16} />
                Google
              </button>
              <button
                type="button"
                onClick={() => signIn("discord", { callbackUrl: "/" })}
                className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/50 bg-[#5865F2]/20 px-3 py-1.5 font-semibold text-white transition hover:bg-[#5865F2]/35"
              >
                Discord
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
