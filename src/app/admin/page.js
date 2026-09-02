"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Crown,
  Headphones,
  Map,
  Plus,
  Settings,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import AdminSetupEditor from "@/components/AdminSetupEditor";
import { getGuides, getTracks, saveGuides, saveTracks } from "@/lib/store";
import { useLanguage } from "@/lib/i18n";

const tabs = [
  { id: "tracks", label: "Tracks", icon: Map },
  { id: "setups", label: "Setups", icon: Settings },
  { id: "users", label: "Users", icon: UserRound },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "guides", label: "Guides", icon: BookOpen },
  { id: "tickets", label: "Tickets", icon: Headphones },
];

export default function AdminPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("tracks");
  const [tracks, setTracks] = useState([]);
  const [guides, setGuides] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [trackForm, setTrackForm] = useState({ country: "", circuit: "", type: "", flagCode: "it" });
  const [guideForm, setGuideForm] = useState({ title: "", description: "" });
  const [editingTrackSlug, setEditingTrackSlug] = useState(null);
  const [editingGuideTitle, setEditingGuideTitle] = useState(null);
  const [ticketReply, setTicketReply] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || !session?.user?.admin) {
      router.replace("/admin/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    setTracks(getTracks());
    setGuides(getGuides());
  }, []);

  const refreshTickets = useCallback(() => {
    fetch("/api/tickets", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setTickets(d.tickets || []))
      .catch(() => setTickets([]));
  }, []);

  useEffect(() => {
    if (active === "tickets" && session?.user?.admin) refreshTickets();
  }, [active, session?.user?.admin, refreshTickets]);

  const refreshUsers = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.admin) return;
    refreshUsers();
  }, [session?.user?.admin, status]);

  const premiumCount = useMemo(() => users.filter((user) => user.premium).length, [users]);

  const persistTracks = (next) => {
    setTracks(next);
    saveTracks(next);
  };

  const persistGuides = (next) => {
    setGuides(next);
    saveGuides(next);
  };

  const resetTrackForm = () => {
    setEditingTrackSlug(null);
    setTrackForm({ country: "", circuit: "", type: "", flagCode: "it" });
  };

  const resetGuideForm = () => {
    setEditingGuideTitle(null);
    setGuideForm({ title: "", description: "" });
  };

  const saveTrack = (event) => {
    event.preventDefault();
    if (!trackForm.country.trim() || !trackForm.circuit.trim()) return;

    const slug = `${trackForm.country}-${trackForm.circuit}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const next = editingTrackSlug
      ? tracks.map((item) =>
          item.slug === editingTrackSlug
            ? {
                slug,
                country: trackForm.country.trim(),
                circuit: trackForm.circuit.trim(),
                type: trackForm.type.trim() || "Custom setup",
                flagCode: trackForm.flagCode.trim().toLowerCase() || "xx",
              }
            : item
        )
      : [
          ...tracks,
          {
            slug,
            country: trackForm.country.trim(),
            circuit: trackForm.circuit.trim(),
            type: trackForm.type.trim() || "Custom setup",
            flagCode: trackForm.flagCode.trim().toLowerCase() || "xx",
          },
        ];

    persistTracks(next);
    resetTrackForm();
  };

  const editTrack = (track) => {
    setEditingTrackSlug(track.slug);
    setTrackForm({ country: track.country, circuit: track.circuit, type: track.type, flagCode: track.flagCode || "it" });
  };

  const saveGuide = (event) => {
    event.preventDefault();
    if (!guideForm.title.trim() || !guideForm.description.trim()) return;

    const next = editingGuideTitle
      ? guides.map((item) =>
          item.title === editingGuideTitle
            ? { title: guideForm.title.trim(), description: guideForm.description.trim() }
            : item
        )
      : [...guides, { title: guideForm.title.trim(), description: guideForm.description.trim() }];

    persistGuides(next);
    resetGuideForm();
  };

  const editGuide = (guide) => {
    setEditingGuideTitle(guide.title);
    setGuideForm({ title: guide.title, description: guide.description });
  };

  const patchUser = async (email, body) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...body }),
    });
    const data = await res.json();
    if (res.ok && data.users) {
      setUsers(data.users);
      if (session?.user?.email?.toLowerCase() === String(email).toLowerCase()) {
        await update();
      }
    }
  };

  const addTrack = (event) => {
    event.preventDefault();
    if (!trackForm.country.trim() || !trackForm.circuit.trim()) return;
    const slug = `${trackForm.country}-${trackForm.circuit}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    persistTracks([
      ...tracks,
      {
        slug,
        country: trackForm.country.trim(),
        circuit: trackForm.circuit.trim(),
        type: trackForm.type.trim() || "Custom setup",
        flagCode: trackForm.flagCode.trim().toLowerCase() || "xx",
      },
    ]);
    setTrackForm({ country: "", circuit: "", type: "", flagCode: "it" });
  };

  const addGuide = (event) => {
    event.preventDefault();
    if (!guideForm.title.trim() || !guideForm.description.trim()) return;
    persistGuides([...guides, { title: guideForm.title.trim(), description: guideForm.description.trim() }]);
    setGuideForm({ title: "", description: "" });
  };

  const togglePremium = (email) => {
    const user = users.find((u) => u.email === email);
    if (!user) return;
    patchUser(email, { premium: !user.premium });
  };

  const toggleAdmin = (email) => {
    const user = users.find((u) => u.email === email);
    if (!user) return;
    patchUser(email, { admin: !user.admin });
  };

  const setTicketStatusRemote = async (id, status) => {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (res.ok) refreshTickets();
  };

  const sendAdminReply = async (id) => {
    if (!ticketReply.trim()) return;
    const res = await fetch(`/api/tickets/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ body: ticketReply.trim() }),
    });
    if (res.ok) {
      setTicketReply("");
      refreshTickets();
    }
  };

  const selectedTicket = tickets.find((x) => x.id === selectedTicketId) || null;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#070707] text-white">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 pt-32 text-center text-white/50">Loading…</main>
      </div>
    );
  }

  if (!session?.user?.admin) {
    return (
      <div className="min-h-screen bg-[#070707] text-white">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 pt-32 text-center">
          <p className="text-violet-300">Admin access required</p>
          <a href="/admin/login" className="mt-6 inline-flex rounded-xl bg-amber-600 px-5 py-3 font-bold text-white hover:bg-amber-500">
            Login staff
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div>
          <p className="text-violet-400">{t("adminPanel")}</p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight">Admin Panel</h1>
          <p className="mt-2 text-white/58">{t("managePlatform")}</p>

          <div className="mt-10 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/4 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    active === tab.id ? "bg-violet-500 text-white" : "text-white/62 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {active === "tracks" ? (
            <section className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black uppercase">Tracks ({tracks.length})</h2>
              </div>
              <form onSubmit={saveTrack} className="mb-6 grid gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-5">
                {[
                  ["country", "Country"],
                  ["circuit", "Circuit"],
                  ["type", "Type"],
                  ["flagCode", "Flag"],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    value={trackForm[key]}
                    onChange={(event) => setTrackForm({ ...trackForm, [key]: event.target.value })}
                    placeholder={label}
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-violet-400/60"
                  />
                ))}
                <div className="flex items-center gap-2">
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-500 px-4 py-2 font-bold">
                    <Plus size={16} />
                    {editingTrackSlug ? "Save Track" : "Add Track"}
                  </button>
                  {editingTrackSlug ? (
                    <button type="button" onClick={resetTrackForm} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5">
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>
              <div className="space-y-2">
                {tracks.map((track, index) => (
                  <div key={track.slug} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/4 p-4">
                    <div>
                      <p>
                        <span className="mr-4 text-violet-400">R{String(index + 1).padStart(2, "0")}</span>
                        {track.country} - {track.circuit}
                      </p>
                      <p className="text-sm text-white/50">{track.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => editTrack(track)}
                        className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => persistTracks(tracks.filter((item) => item.slug !== track.slug))}
                        title="Delete track"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-300 transition hover:bg-red-500/15 hover:text-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {active === "users" ? (
            <section className="mt-10">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-xl font-black uppercase">Users ({users.length}) — Premium ({premiumCount})</h2>
                <button
                  type="button"
                  onClick={() => refreshUsers()}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                >
                  Refresh
                </button>
              </div>
              <p className="mb-5 text-sm text-white/45">
                Lista server-side: compaiono gli account che hanno effettuato accesso con Google o Discord (file{" "}
                <code className="text-violet-200/90">data/users.json</code> in locale).
              </p>
              {users.length === 0 ? (
                <p className="rounded-xl border border-white/10 bg-white/4 p-8 text-white/55">Nessun utente ancora. Effettua un login OAuth per popolare la lista.</p>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.email}
                      className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/4 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-white/50">{user.email}</p>
                        {user.provider ? <p className="mt-1 text-xs text-white/35">via {user.provider}</p> : null}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAdmin(user.email)}
                          className={`rounded-lg border px-4 py-2 text-sm ${user.admin ? "border-violet-400 text-violet-200" : "border-white/10 text-white/62"}`}
                        >
                          ADMIN
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePremium(user.email)}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${user.premium ? "bg-violet-500 text-white" : "border border-white/10 text-white/72"}`}
                        >
                          <Crown size={15} />
                          {user.premium ? "Premium" : "Free"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {active === "guides" ? (
            <section className="mt-10">
              <h2 className="text-xl font-black uppercase">Guides ({guides.length})</h2>
              <form onSubmit={saveGuide} className="mt-5 grid gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[0.6fr,1fr,auto]">
                <input
                  value={guideForm.title}
                  onChange={(event) => setGuideForm({ ...guideForm, title: event.target.value })}
                  placeholder="Title"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-violet-400/60"
                />
                <input
                  value={guideForm.description}
                  onChange={(event) => setGuideForm({ ...guideForm, description: event.target.value })}
                  placeholder="Description"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-violet-400/60"
                />
                <div className="flex items-center gap-2">
                  <button type="submit" className="rounded-lg bg-violet-500 px-4 py-2 font-bold">
                    {editingGuideTitle ? "Save Guide" : "Add Guide"}
                  </button>
                  {editingGuideTitle ? (
                    <button type="button" onClick={resetGuideForm} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5">
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>
              <div className="mt-5 space-y-2">
                {guides.map((guide) => (
                  <div key={guide.title} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/4 p-4">
                    <div>
                      <p className="font-bold">{guide.title}</p>
                      <p className="text-sm text-white/50">{guide.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => editGuide(guide)}
                        className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => persistGuides(guides.filter((item) => item.title !== guide.title))}
                        title="Delete guide"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-300 transition hover:bg-red-500/15 hover:text-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {active === "tickets" ? (
            <section className="mt-10">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-xl font-black uppercase">Tickets supporto ({tickets.length})</h2>
                <button
                  type="button"
                  onClick={() => refreshTickets()}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                >
                  Aggiorna
                </button>
              </div>
              <p className="mb-6 text-sm text-white/45">
                I messaggi degli utenti arrivano da <code className="text-violet-200/90">data/tickets.json</code>. Rispondi qui: le risposte compaiono nella zona Supporto dell&apos;utente.
              </p>
              <div className="grid min-h-120 gap-4 lg:grid-cols-[minmax(0,38%)_1fr]">
                <div className="max-h-140 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-black/25 p-3">
                  {tickets.length === 0 ? (
                    <p className="text-sm text-white/45">Nessun ticket.</p>
                  ) : (
                    tickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        type="button"
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition ${
                          selectedTicketId === ticket.id ? "border-violet-400/50 bg-violet-500/12" : "border-white/10 bg-[#141414] hover:border-white/20"
                        }`}
                      >
                        <p className="font-bold text-white">{ticket.subject}</p>
                        <p className="mt-1 text-xs text-white/45">{ticket.email}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-wider text-amber-200/80">{ticket.status}</p>
                      </button>
                    ))
                  )}
                </div>
                <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
                  {!selectedTicket ? (
                    <p className="text-sm text-white/45">Seleziona un ticket.</p>
                  ) : (
                    <div className="flex h-full flex-col">
                      <div className="border-b border-white/10 pb-4">
                        <p className="text-lg font-bold">{selectedTicket.subject}</p>
                        <p className="mt-1 text-xs text-white/45">{selectedTicket.email}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setTicketStatusRemote(selectedTicket.id, selectedTicket.status === "Open" ? "Closed" : "Open")}
                            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold uppercase text-white/80 hover:bg-white/15"
                          >
                            {selectedTicket.status === "Open" ? "Chiudi" : "Riapri"}
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 max-h-60 flex-1 space-y-3 overflow-y-auto">
                        <div className="rounded-lg border border-white/8 bg-black/30 p-3">
                          <p className="text-xs font-bold uppercase text-white/40">Messaggio utente</p>
                          <p className="mt-2 text-sm text-white/75">{selectedTicket.message}</p>
                        </div>
                        {(selectedTicket.replies || []).map((r) => (
                          <div
                            key={r.id}
                            className={`rounded-lg border p-3 ${r.author === "admin" ? "border-amber-500/30 bg-amber-500/10" : "border-white/8 bg-black/25"}`}
                          >
                            <p className="text-xs font-bold uppercase text-white/40">
                              {r.author === "admin" ? "Staff (tu)" : "Utente"} — {new Date(r.at).toLocaleString("it-IT")}
                            </p>
                            <p className="mt-2 text-sm text-white/80">{r.body}</p>
                          </div>
                        ))}
                      </div>
                      {selectedTicket.status === "Open" ? (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <label className="text-xs font-bold uppercase text-violet-200/80">Risposta staff</label>
                          <textarea
                            value={ticketReply}
                            onChange={(e) => setTicketReply(e.target.value)}
                            rows={4}
                            className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/50"
                            placeholder="Scrivi la risposta che vedrà l’utente in Supporto…"
                          />
                          <button
                            type="button"
                            onClick={() => sendAdminReply(selectedTicket.id)}
                            className="mt-3 rounded-lg bg-violet-500 px-4 py-2 text-sm font-bold text-white hover:bg-violet-400"
                          >
                            Invia risposta
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : null}

          {active === "setups" ? (
            <section className="mt-10 rounded-xl border border-white/10 bg-white/4 p-6 sm:p-8">
              <h2 className="text-xl font-black uppercase">Setup piste</h2>
              <p className="mt-2 text-sm text-white/50">
                Dati in <code className="text-violet-200/90">data/track-setups.json</code> — Gara, Qualifica, Bagnato per ogni circuito.
              </p>
              <div className="mt-8">
                <AdminSetupEditor />
              </div>
            </section>
          ) : null}

          {active === "reviews" ? (
            <section className="mt-10 rounded-xl border border-white/10 bg-white/4 p-8">
              <h2 className="text-xl font-black uppercase">Reviews</h2>
              <p className="mt-3 text-white/58">Area pronta per collegare dati reali: puoi usare questo spazio per aggiungere review gestite.</p>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
