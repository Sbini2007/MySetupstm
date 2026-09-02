"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AuthGate from "@/components/AuthGate";
import { UserRound, Save, LogOut, RefreshCw } from "lucide-react";

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    setName(session.user.name || "");
    setImage(session.user.image || "");
  }, [session, status]);

  const loadFromServer = () => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.name != null) setName(data.name);
        if (data.image != null) setImage(data.image);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (status === "authenticated") loadFromServer();
  }, [status]);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Seleziona un file immagine.");
      return;
    }
    if (file.size > 350 * 1024) {
      setMessage("Immagine troppo grande (max 350KB).");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") setImage(result);
      setMessage("");
    };
    reader.readAsDataURL(file);
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), image: image.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Salvataggio non riuscito.");
        return;
      }
      await update();
      setMessage("Profilo aggiornato.");
    } catch {
      setMessage("Errore di rete.");
    } finally {
      setSaving(false);
    }
  };

  const resetAvatarToProvider = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), image: "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Errore.");
        return;
      }
      await update();
      setMessage("Avatar ripristinato da Google/Discord.");
    } finally {
      setSaving(false);
    }
  };

  const previewSrc = image?.trim() || session?.user?.image || "";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />
      <AuthGate>
        <main className="mx-auto max-w-lg px-4 pb-24 pt-28 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-violet-300/90">Account</p>
          <h1 className="mt-2 text-3xl font-black">Il tuo profilo</h1>
          <p className="mt-2 text-sm text-white/55">Nome e immagine visibili sul sito. L&apos;email resta quella del login OAuth.</p>

          <form onSubmit={save} className="mt-10 space-y-6 rounded-2xl border border-white/10 bg-[#111111]/90 p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/15 bg-black/50 ring-2 ring-violet-500/20">
                {previewSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element -- data URLs / arbitrary hosts
                  <img src={previewSrc} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-white/35">
                    <UserRound size={40} />
                  </div>
                )}
              </div>
              <div className="w-full flex-1 space-y-2 text-sm">
                <label className="block text-white/50">Immagine profilo</label>
                <input type="file" accept="image/*" onChange={handleFile} className="w-full text-xs text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:text-white" />
                <p className="text-xs text-white/40">Oppure incolla un URL immagine qui sotto.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/50">URL immagine (opzionale)</label>
              <input
                value={image.startsWith("data:") ? "" : image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://…"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-violet-400/50"
              />
              {image.startsWith("data:") ? (
                <p className="mt-1 text-xs text-violet-200/80">Stai usando un&apos;immagine caricata dal dispositivo.</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm text-white/50">Nome visualizzato</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-violet-400/50"
              />
            </div>

            <p className="text-xs text-white/40">Email (non modificabile): {session?.user?.email}</p>

            {message ? <p className="text-sm text-violet-200">{message}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-bold disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Salvataggio…" : "Salva profilo"}
              </button>
              <button
                type="button"
                onClick={resetAvatarToProvider}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/5 disabled:opacity-50"
              >
                <RefreshCw size={16} />
                Avatar da OAuth
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold text-white/70">Sessione</p>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/20"
            >
              <LogOut size={18} />
              Logout
            </button>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login?reauth=1" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/35 bg-amber-500/10 px-5 py-3 text-sm font-bold text-amber-100 transition hover:bg-amber-500/18"
            >
              Cambia account
            </button>
            <p className="text-xs text-white/40">
              «Cambia account» ti porta al login: al prossimo accesso Google puoi scegliere un altro utente (account picker).
            </p>
          </div>

          <Link href="/setups" className="mt-8 inline-flex text-sm font-semibold text-violet-300 hover:text-violet-200">
            ← Torna ai setup
          </Link>
        </main>
      </AuthGate>
      <Footer />
    </div>
  );
}
