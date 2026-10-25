"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Shield, User, LogOut, ArrowRight, KeyRound, Save, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/client-auth";
import { canAccessSetups, canManageSetups, getUserRole, ROLE_BADGES } from "@/lib/rbac";

export default function AccountPage() {
  const { user, status, loginAsDiego, logout, update } = useAuth();
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

        <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-28 sm:px-6">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <span className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-violet-300">
              Area personale
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Il tuo account
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
              Gestisci il tuo profilo e le credenziali di accesso da un unico posto.
            </p>
          </div>

          {status === "loading" ? (
            <div className="rounded-2xl border border-white/10 bg-[#0c0d16] p-12 text-center text-sm text-zinc-400">
              Verifica dell'account in corso...
            </div>
          ) : user ? (
            /* Logged in state */
            <div className="space-y-6">
              {/* Profile Card */}
              <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0d16] p-5 shadow-2xl shadow-black/20 sm:p-7">
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-600/[0.08] blur-3xl" />
                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-2xl font-black text-violet-200">
                      {(user.name || user.email || "P")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-lg font-bold text-white sm:text-xl">{user.name || "Pilota MySetups"}</h2>
                        <span className={`rounded-full border px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider ${badgeInfo.color}`}>
                          {badgeInfo.label}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 break-all text-xs text-zinc-400">
                        <Mail size={13} className="shrink-0" />
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-zinc-300">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      Account verificato
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-zinc-300">
                      {canAccessSetups(user) ? (
                        <>
                          <KeyRound size={14} className="text-violet-300" />
                          {canManageSetups(user) ? "Gestione setup" : "Visualizzazione setup"}
                        </>
                      ) : (
                        <>
                          <KeyRound size={14} className="text-zinc-500" />
                          Accesso setup non attivo
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {user.admin ? (
                  <div className="relative mt-6 border-t border-white/[0.08] pt-5">
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.08] px-4 py-2.5 text-xs font-bold text-amber-200 transition hover:border-amber-300/40 hover:bg-amber-400/[0.14]"
                    >
                      <Shield size={14} />
                      <span>Apri Pannello Admin</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : null}
              </section>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Edit Name Form */}
                <form onSubmit={handleUpdateName} className="rounded-2xl border border-white/10 bg-[#0c0d16] p-5 sm:p-6">
                  <div className="mb-5">
                    <h3 className="text-sm font-bold text-white">Nome visualizzato</h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">Questo è il nome che appare sul tuo profilo.</p>
                  </div>
                  <label htmlFor="account-name" className="mb-2 block text-xs font-medium text-zinc-300">Nome pilota</label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="account-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Il tuo nome pilota"
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    />
                    <button
                      type="submit"
                      disabled={saving || !name.trim()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-xs font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save size={14} />
                      {saving ? "Salvataggio..." : "Salva"}
                    </button>
                  </div>
                  {message && (
                    <p role="status" className="mt-3 text-xs font-medium text-emerald-400">{message}</p>
                  )}
                </form>

                <form onSubmit={handleSetPassword} className="rounded-2xl border border-white/10 bg-[#0c0d16] p-5 sm:p-6">
                  <div className="mb-5">
                    <h3 className="text-sm font-bold text-white">Sicurezza e password</h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">Imposta una password per accedere anche con email.</p>
                  </div>
                  <div className="space-y-3">
                    <label className="sr-only" htmlFor="account-current-password">Password attuale</label>
                    <input
                      id="account-current-password"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      placeholder="Password attuale, se già impostata"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    />
                    <label className="sr-only" htmlFor="account-new-password">Nuova password</label>
                    <input
                      id="account-new-password"
                      type="password"
                      required
                      minLength={8}
                      maxLength={128}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Nuova password (almeno 8 caratteri)"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    />
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-semibold text-zinc-100 transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <KeyRound size={14} />
                      {savingPassword ? "Salvataggio..." : "Aggiorna password"}
                    </button>
                  </div>
                  {passwordMessage && <p role="status" className="mt-3 text-xs text-zinc-300">{passwordMessage}</p>}
                </form>
              </div>

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
