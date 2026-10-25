"use client";

import { useState } from "react";
import { signIn } from "@/lib/client-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowRight, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("diegocruciani40@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdminSignIn = async (targetEmail = email) => {
    if (targetEmail === "google") {
      await signIn("google", { callbackUrl: "/admin" });
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: targetEmail,
        password: password || "",
      });

      if (res?.error) {
        throw new Error(res.error || "Accesso non autorizzato");
      }

      router.replace("/admin");
    } catch (err) {
      setErrorMsg(err.message || "Errore di accesso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <NavBar />
      <main className="relative mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-4 py-16">
        <div className="w-full rounded-3xl border border-white/10 bg-[#0c0d16] p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.04] text-zinc-200">
            <Shield size={26} />
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            <Lock size={11} />
            <span>Pannello di Controllo Riservato</span>
          </div>

          <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-white">
            Accesso Amministratore
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Modifica setup, telemetrie dei 25 circuiti e gestisci la lista di tutti gli utenti iscritti al server.
          </p>

          {errorMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-left text-xs text-red-300">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Access for Main Admin */}
          <div className="mt-6">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleAdminSignIn("google")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-black shadow-lg transition hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "Accesso in corso..." : "Verifica account staff con Google"}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-[#0c0d16] px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Oppure inserisci email staff
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdminSignIn();
            }}
            className="space-y-3 text-left"
          >
            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Email Staff
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mysetups.it"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-white/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-zinc-200 transition hover:bg-white/[0.1] hover:text-white disabled:opacity-50 cursor-pointer"
            >
              <span>Accedi al Pannello Admin</span>
              <ArrowRight size={13} />
            </button>
          </form>

          <p className="mt-6 text-[10px] font-mono text-zinc-500">
            Account autorizzati: diegocruciani40@gmail.com, diegocruciani256@gmail.com
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
