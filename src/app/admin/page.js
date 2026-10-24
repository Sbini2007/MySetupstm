"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Shield,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AdminSetupEditor from "@/components/AdminSetupEditor";
import { getGuides, getTracks, saveGuides, saveTracks } from "@/lib/store";
import { useLanguage } from "@/lib/i18n";
import { USER_ROLES, ROLE_LABELS, ROLE_BADGES, getUserRole } from "@/lib/rbac";
import { safeFetchJson } from "@/lib/safe-json";
import { useAuth } from "@/lib/client-auth";

const tabs = [
  { id: "setups", label: "Modifica Setup", icon: Settings },
  { id: "users", label: "Utenti Iscritti", icon: UserRound },
  { id: "tracks", label: "Circuiti", icon: Map },
  { id: "tickets", label: "Ticket", icon: Headphones },
  { id: "guides", label: "Guide", icon: BookOpen },
  { id: "reviews", label: "Recensioni", icon: Star },
];

export default function AdminPage() {
  const { user, status, isAdmin, loginAsDiego } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState("setups");
  const [tracks, setTracks] = useState([]);
  const [guides, setGuides] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [trackForm, setTrackForm] = useState({ country: "", circuit: "", type: "", flagCode: "it" });
  const [guideForm, setGuideForm] = useState({ title: "", description: "" });
  const [editingTrackSlug, setEditingTrackSlug] = useState(null);
  const [editingGuideTitle, setEditingGuideTitle] = useState(null);
  const [ticketReply, setTicketReply] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    setTracks(getTracks());
    setGuides(getGuides());
  }, []);

  const refreshTickets = useCallback(() => {
    safeFetchJson("/api/tickets", { credentials: "include" })
      .then((d) => setTickets(d?.tickets || []))
      .catch(() => setTickets([]));
  }, []);

  useEffect(() => {
    if (active === "tickets" && isAdmin) refreshTickets();
  }, [active, isAdmin, refreshTickets]);

  const refreshUsers = () => {
    safeFetchJson("/api/admin/users")
      .then((data) => {
        if (data?.users) setUsers(data.users);
      })
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    if (isAdmin) refreshUsers();
  }, [isAdmin]);

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

  const deleteUser = async (email) => {
    if (!window.confirm(`Eliminare definitivamente l'utente ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      }
    } catch {
      alert("Errore durante l'eliminazione.");
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail.trim(),
          name: newUserName.trim() || newUserEmail.trim().split("@")[0],
          role: newUserRole,
          premium: newUserRole !== "user",
          admin: newUserRole === "admin",
        }),
      });
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
        setNewUserEmail("");
        setNewUserName("");
        setAddUserOpen(false);
      } else {
        alert(data.error || "Errore nella creazione utente");
      }
    } catch {
      alert("Errore durante la creazione utente.");
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col justify-between">
        <NavBar />
        <main className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center px-4 py-24">
          <div className="w-full rounded-3xl border border-white/10 bg-[#0c0d16] p-8 text-center shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.04] text-amber-400 mb-4">
              <Shield size={26} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Pannello Amministratore
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Accedi con l'account staff autorizzato per modificare gli assetti e gestire tutti gli utenti iscritti al server.
            </p>
            <button
              type="button"
              onClick={loginAsDiego}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-black shadow-lg transition hover:bg-zinc-200 cursor-pointer"
            >
              <span>Verifica account staff con Google</span>
            </button>
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <Link href="/login?redirect=/admin" className="text-xs text-zinc-400 hover:text-white transition">
                Accedi con un'altra email staff →
              </Link>
            </div>
          </div>
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
                <div>
                  <h2 className="text-xl font-black uppercase text-white">
                    Utenti Iscritti al Server ({users.length})
                  </h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    Visualizza tutti i piloti registrati nel server, le date di iscrizione e assegna ruoli o permessi.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAddUserOpen(!addUserOpen)}
                    className="rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-black transition hover:bg-zinc-200"
                  >
                    {addUserOpen ? "Chiudi Modulo" : "+ Iscrivi Nuovo Pilota"}
                  </button>
                  <button
                    type="button"
                    onClick={() => refreshUsers()}
                    className="rounded-lg border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                  >
                    Aggiorna
                  </button>
                </div>
              </div>

              {/* Add User Form Accordion */}
              {addUserOpen && (
                <form
                  onSubmit={createUser}
                  className="mb-6 rounded-2xl border border-white/15 bg-[#0e0f1a] p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                >
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                      Nome Pilota
                    </label>
                    <input
                      type="text"
                      placeholder="Nome e Cognome"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="pilota@email.it"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                      Ruolo Iniziale
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#141522] px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="user">Pilota Free / Visitatore</option>
                      <option value="subscriber">Accesso ai setup</option>
                      <option value="vip">VIP Member</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Amministratore</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-white px-4 py-2 text-xs font-black uppercase text-black hover:bg-zinc-200 transition"
                  >
                    Salva Utente
                  </button>
                </form>
              )}

              {/* Roles Summary Counter Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                <div className="rounded-xl border border-white/[0.08] bg-[#0c0d15]/80 p-3">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Totale Account</span>
                  <span className="text-lg font-black font-mono text-white mt-0.5 block">{users.length}</span>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block">Accesso ai setup</span>
                  <span className="text-lg font-black font-mono text-emerald-300 mt-0.5 block">
                    {users.filter((u) => getUserRole(u) === "subscriber").length}
                  </span>
                </div>
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
                  <span className="text-[10px] font-mono uppercase text-violet-400 block">VIP Members</span>
                  <span className="text-lg font-black font-mono text-violet-300 mt-0.5 block">
                    {users.filter((u) => getUserRole(u) === "vip").length}
                  </span>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <span className="text-[10px] font-mono uppercase text-amber-400 block">Editor Setup</span>
                  <span className="text-lg font-black font-mono text-amber-300 mt-0.5 block">
                    {users.filter((u) => getUserRole(u) === "editor").length}
                  </span>
                </div>
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                  <span className="text-[10px] font-mono uppercase text-red-400 block">Admin Staff</span>
                  <span className="text-lg font-black font-mono text-red-300 mt-0.5 block">
                    {users.filter((u) => getUserRole(u) === "admin").length}
                  </span>
                </div>
              </div>

              {/* Search User Input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Cerca utente per nome o email..."
                  className="w-full max-w-md rounded-xl border border-white/10 bg-[#0c0d15]/80 px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-white/30"
                />
              </div>

              {users.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0c0d15] p-8 text-center text-zinc-400">
                  <p className="font-semibold text-white">Nessun utente iscritto nel server.</p>
                  <p className="text-xs mt-1">Usa il pulsante sopra per aggiungere un pilota o effettua un'iscrizione dalla pagina di login.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users
                    .filter((u) => {
                      const q = userSearch.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        (u.name && u.name.toLowerCase().includes(q)) ||
                        (u.email && u.email.toLowerCase().includes(q))
                      );
                    })
                    .map((user) => {
                      const role = getUserRole(user);
                      const badge = ROLE_BADGES[role] || ROLE_BADGES.user;
                      const dateStr = user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("it-IT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Data non registrata";

                      return (
                        <div
                          key={user.email}
                          className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0c0d15]/90 p-4 lg:flex-row lg:items-center lg:justify-between transition hover:border-white/15"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center font-bold text-sm text-zinc-300 overflow-hidden">
                              {user.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.image} alt="" className="h-full w-full object-cover" />
                              ) : (
                                (user.name || user.email || "U")[0].toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-white">{user.name || "Utente"}</p>
                                <span className={`rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${badge.color}`}>
                                  {badge.label}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400">{user.email}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-[10px] font-mono text-zinc-500">
                                  Iscritto: {dateStr}
                                </span>
                                {user.provider ? (
                                  <span className="text-[10px] font-mono text-zinc-500">
                                    · via {user.provider}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          {/* RBAC Role Selector Dropdown & Actions */}
                          <div className="flex items-center gap-3 self-end lg:self-center">
                            <div className="flex flex-col items-start sm:items-end">
                              <span className="text-[10px] font-mono uppercase text-zinc-500 mb-1">
                                Assegna Ruolo:
                              </span>
                              <select
                                value={role}
                                onChange={(e) => patchUser(user.email, { role: e.target.value })}
                                className="rounded-lg border border-white/[0.12] bg-[#141522] px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer hover:border-white/30 transition"
                              >
                                <option value="user" className="bg-[#0f1019] text-zinc-300">
                                  Visitatore / Free
                                </option>
                                <option value="subscriber" className="bg-[#0f1019] text-emerald-300">
                                  Accesso ai setup
                                </option>
                                <option value="vip" className="bg-[#0f1019] text-violet-300">
                                  VIP Member
                                </option>
                                <option value="editor" className="bg-[#0f1019] text-amber-300">
                                  Editor (Modifica Setup)
                                </option>
                                <option value="admin" className="bg-[#0f1019] text-red-300">
                                  Amministratore (Admin)
                                </option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteUser(user.email)}
                              title="Elimina utente"
                              className="mt-4 lg:mt-0 p-2 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/20 transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
      <Footer />
    </div>
  );
}
