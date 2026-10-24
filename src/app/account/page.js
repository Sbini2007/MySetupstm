"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Shield, User, LogOut, Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/client-auth";
import { getUserRole, ROLE_BADGES } from "@/lib/rbac";

export default function AccountPage() {
  const { user, status, isAdmin, loginAsDiego, logout, update } = useAuth();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const userRole = getUserRole(user);
  const badgeInfo = ROLE_BADGES[userRole] || ROLE_BADGES.user;

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        await update();
        setMessage("Nome profilo aggiornato con successo.");
        setTimeout(() => setMessage(""), 3500);
      } else {
        setMessage("Errore durante l'aggiornamento.");
      }
    } catch {
      setMessage("Errore di connessione.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetPassword = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordMessage("");
    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Impossibile aggiornare la password.");
      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage("Password impostata. Ora puoi accedere con email e password.");
    } catch (error) {
      setPasswordMessage(error.message || "Errore durante l'aggiornamento della password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col justify-between">
      <div>
        <NavBar />

        <main className="mx-auto max-w-xl px-4 pb-24 pt-24 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1">
              Profilo Utente
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              Il tuo Account Pilota
            </h1>
          </div>

          {status === "loading" ? (
            <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-12 text-center text-xs font-mono text-zinc-400">
              Verifica account in corso...
            </div>
          ) : user ? (
            /* Logged in state */
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 border-b border-white/[0.08] pb-5">
                  <div className="h-14 w-14 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center font-black text-xl text-white">
                    {(user.name || user.email || "P")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{user.name || "Pilota MySetups"}</h2>
                      <span className={`rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${badgeInfo.color}`}>
                        {badgeInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Stato Ruolo</span>
                    <span className="font-semibold text-white">{user.admin ? "Amministratore Staff (Accesso Totale)" : "Pilota Registrato"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Permessi Modifica Setup</span>
                    <span className="font-semibold text-emerald-400">{user.admin ? "Abilitati (Quali, Gara, Parco Chiuso)" : "Sola Lettura"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Autenticazione</span>
                    <span className="font-mono text-zinc-300">Sessione protetta</span>
                  </div>
                </div>

                {user.admin ? (
                  <div className="mt-6 pt-5 border-t border-white/[0.08]">
                    <Link
                      href="/admin"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-5 py-3 text-xs font-black uppercase tracking-wider text-amber-300 transition hover:bg-amber-500/25 cursor-pointer"
                    >
                      <Shield size={14} />
                      <span>Apri Pannello Admin</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : null}
              </div>

              {/* Edit Name Form */}
              <form onSubmit={handleUpdateName} className="rounded-2xl border border-white/10 bg-[#0c0d16] p-6 shadow-xl">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
                  Modifica Nome Visualizzato
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Il tuo nome pilota..."
                    className="flex-1 rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white outline-none focus:border-white/30"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-white px-5 py-2.5 text-xs font-black uppercase text-black hover:bg-zinc-200 transition disabled:opacity-50 cursor-pointer"
                  >
                    Salva
                  </button>
                </div>
                {message && (
                  <p className="mt-3 text-xs text-emerald-400 font-medium">{message}</p>
                )}
              </form>

              <form onSubmit={handleSetPassword} className="rounded-2xl border border-white/10 bg-[#0c0d16] p-6 shadow-xl">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
                  Imposta password per accessi futuri
                </h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="Password attuale, se ne hai già una"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white outline-none focus:border-white/30"
                  />
                  <input
                    type="password"
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Nuova password (minimo 8 caratteri)"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white outline-none focus:border-white/30"
                  />
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="rounded-xl bg-white px-5 py-2.5 text-xs font-black uppercase text-black transition hover:bg-zinc-200 disabled:opacity-50"
                  >
                    {savingPassword ? "Salvataggio..." : "Imposta password"}
                  </button>
                </div>
                {passwordMessage && <p className="mt-3 text-xs text-zinc-300">{passwordMessage}</p>}
              </form>

              {/* Logout button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-red-400 transition cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Esci dal tuo account</span>
                </button>
              </div>
            </div>
          ) : (
            /* Unauthenticated state */
            <div className="rounded-3xl border border-white/10 bg-[#0c0d16] p-8 text-center shadow-2xl">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.04] text-zinc-300 mb-5">
                <User size={24} />
              </div>

              <h2 className="text-xl font-black uppercase text-white tracking-tight">
                Accedi al tuo Account
              </h2>
              <p className="mt-2 text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Non risulti attualmente autenticato. Accedi per gestire il tuo profilo, visualizzare i setup e accedere al pannello admin.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={loginAsDiego}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-black shadow-md hover:bg-zinc-200 transition cursor-pointer"
                >
                  <Shield size={14} />
                  <span>Verifica account staff con Google</span>
                </button>

                <Link
                  href="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-zinc-200 hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
                >
                  <span>Accedi con altre credenziali</span>
                </Link>

                <Link
                  href="/login?mode=register"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent px-5 py-3 text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <span>Non hai un account? Iscriviti subito</span>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
