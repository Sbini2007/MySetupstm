"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/client-auth";
import { canAccessSetups, canManageSetups, getUserRole, ROLE_BADGES } from "@/lib/rbac";

export default function AccountPage() {
  const { user, status, logout } = useAuth();
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.email) {
      const initialName = user.name || "";
      setName(initialName);
      setSavedName(initialName);
    }
  }, [user?.email]);

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
      const responseText = await res.text();
      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error("Il server ha restituito una risposta non valida. Riprova.");
        }
      }
      if (!res.ok) {
        throw new Error(data.error || `Errore durante l'aggiornamento (codice ${res.status}).`);
      }

      const updatedName = data.name || name.trim();
      setName(updatedName);
      setSavedName(updatedName);
      setMessage("Nome profilo aggiornato con successo.");
      setTimeout(() => setMessage(""), 3500);
    } catch (error) {
      setMessage(error.message || "Errore di connessione.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col justify-between">
      <div>
        <NavBar />

        <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-28 sm:px-6">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Il tuo account
            </h1>
          </div>

          {status === "loading" ? (
            <p className="py-10 text-sm text-zinc-400">
              Verifica dell'account in corso...
            </p>
          ) : user ? (
            /* Logged in state */
            <div className="max-w-3xl">
              <section className="border-b border-white/10 pb-7">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-xl font-bold text-white">{savedName || user.name || "Pilota MySetups"}</h2>
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                    {badgeInfo.label}
                  </span>
                </div>
                <p className="mt-2 break-all text-sm text-zinc-400">{user.email}</p>
                <p className="mt-3 text-xs text-zinc-500">
                  {canAccessSetups(user)
                    ? canManageSetups(user) ? "Puoi visualizzare e gestire i setup." : "Puoi visualizzare i setup."
                    : "L'accesso ai setup non è attivo sul tuo account."}
                </p>
                {user.admin && (
                  <Link
                    href="/admin"
                    className="mt-4 inline-block text-sm font-semibold text-violet-300 transition hover:text-violet-200"
                  >
                    Apri pannello admin
                  </Link>
                )}
              </section>

              <form onSubmit={handleUpdateName} className="max-w-xl py-7">
                <h3 className="text-base font-semibold text-white">Nome visualizzato</h3>
                <p className="mt-1 text-sm text-zinc-500">Questo è il nome che appare sul tuo profilo.</p>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <input
                    id="account-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Il tuo nome pilota"
                    className="min-w-0 flex-1 border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400"
                  />
                  <button
                    type="submit"
                    disabled={saving || !name.trim()}
                    className="w-fit text-sm font-semibold text-violet-300 transition hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Salvataggio..." : "Salva"}
                  </button>
                </div>
                {message && <p role="status" className="mt-3 text-sm text-emerald-400">{message}</p>}
              </form>

              <button
                type="button"
                onClick={logout}
                className="border-t border-white/10 pt-5 text-sm font-medium text-zinc-400 transition hover:text-red-400"
              >
                Esci dal tuo account
              </button>
            </div>
          ) : (
            /* Unauthenticated state */
            <div className="max-w-xl py-4">
              <h2 className="text-xl font-bold text-white">Accedi al tuo account</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Accedi per gestire il tuo profilo e visualizzare i setup.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
                <Link href="/login" className="text-violet-300 transition hover:text-violet-200">
                  Accedi
                </Link>
                <Link href="/register" className="text-zinc-400 transition hover:text-white">
                  Crea un account
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
