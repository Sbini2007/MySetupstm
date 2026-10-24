"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import logoImg from "@/assets/images/logo.png";
import { signIn, useSession } from "@/lib/client-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Sparkles, UserPlus, LogIn, Check, AlertCircle, ArrowRight, Shield } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

function LoginInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode); // "login" | "register"
  const redirectTarget = searchParams.get("redirect") || "/setups";

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.admin && redirectTarget.startsWith("/admin")) {
        router.replace("/admin");
      } else {
        router.replace(redirectTarget);
      }
    }
  }, [status, session, router, redirectTarget]);

  if (status === "authenticated" && session?.user) {
    return null;
  }

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!email.trim() || !email.includes("@")) {
          throw new Error("Inserisci un'email valida.");
        }
        if (password.length < 8) {
          throw new Error("La password deve avere almeno 8 caratteri.");
        }

        // 1. Call server registration endpoint
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
        });
        const regData = await regRes.json();
        if (!regRes.ok || !regData.ok) {
          throw new Error(regData.error || "Errore durante l'iscrizione");
        }

        setSuccessMsg("Iscrizione completata! Accesso in corso...");

        // 2. Sign in with newly created credentials
        const signInRes = await signIn("credentials", {
          redirect: false,
          callbackUrl: redirectTarget,
          email: email.trim(),
          password,
        });

        if (!signInRes?.ok) {
          throw new Error(signInRes?.error || "Accesso non riuscito dopo l'iscrizione.");
        }

        window.location.replace(signInRes.url || redirectTarget);
      } else {
        // Mode === "login"
        if (!email.trim()) {
          throw new Error("Inserisci la tua email.");
        }

        const res = await signIn("credentials", {
          redirect: false,
          callbackUrl: redirectTarget,
          email: email.trim(),
          password,
        });

        if (!res?.ok) {
          throw new Error(res?.error ? "Credenziali non valide o password errata." : "Accesso non riuscito.");
        }

        window.location.replace(res.url || redirectTarget);
      }
    } catch (err) {
      setErrorMsg(err.message || "Si è verificato un errore.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <NavBar />
      <main className="relative mx-auto flex min-h-[85vh] max-w-md items-center justify-center px-4 py-16">
        <div className="w-full rounded-3xl border border-white/10 bg-[#0c0d16] p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient glow */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-16 w-16">
              <Image
                src={logoImg}
                alt="MySetups"
                className="h-full w-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                priority
              />
            </div>
            
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              {mode === "register" ? "ISCRIZIONE PILOTA" : "ACCEDI A MYSETUPS"}
            </h1>
            <p className="mt-1.5 text-xs text-zinc-400">
              {mode === "register"
                ? "Registrati per salvare assetti, visualizzare telemetrie e accedere all'hub F1 26."
                : "Inserisci le tue credenziali per accedere ai parametri tecnici."}
            </p>
          </div>

          {/* Tab switch between Login and Register */}
          <div className="mt-6 flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mode === "login"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LogIn size={13} />
              <span>Accedi</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mode === "register"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <UserPlus size={13} />
              <span>Iscrizione</span>
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-300">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <Check size={15} className="shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Direct Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="mt-6 space-y-3.5">
            {mode === "register" && (
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  Nome Pilota o Gamertag
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Es. Mario Rossi"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-white/30"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pilota@esempio.it"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-white/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-black shadow-md transition hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Elaborazione in corso...</span>
              ) : mode === "register" ? (
                <>
                  <span>Completa Iscrizione</span>
                  <ArrowRight size={13} />
                </>
              ) : (
                <>
                  <span>Accedi con Credenziali</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Quick Admin Access */}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/15"
            >
              <Shield size={13} />
              <span>Verifica account staff con Google</span>
            </button>
          </div>

          {/* Social Logins Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-[#0c0d16] px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Oppure
            </span>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: redirectTarget })}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
            >
              <span>Continua con Google</span>
            </button>
            <button
              type="button"
              onClick={() => signIn("discord", { callbackUrl: redirectTarget })}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-[#5865F2]/20 px-4 py-2.5 text-xs font-semibold text-[#8a98f7] transition hover:bg-[#5865F2]/30"
            >
              <span>Continua con Discord</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <NavBar />
      <main className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-4 py-16">
        <div className="w-full rounded-3xl border border-white/10 bg-[#0c0d16] p-8 text-center text-xs text-white/50 font-mono">
          Caricamento autenticazione…
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginInner />
    </Suspense>
  );
}
