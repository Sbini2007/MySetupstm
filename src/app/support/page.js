"use client";

import { useEffect, useState, useCallback } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AuthGate from "@/components/AuthGate";
import { useLanguage } from "@/lib/i18n";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [notice, setNotice] = useState("");
  const { t } = useLanguage();

  const selected = tickets.find((x) => x.id === selectedId) || null;

  const refresh = useCallback(() => {
    fetch("/api/tickets", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setTickets(d.tickets || []);
        if (selectedId && !(d.tickets || []).some((x) => x.id === selectedId)) {
          setSelectedId(null);
        }
      })
      .catch(() => setTickets([]));
  }, [selectedId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setNotice("Completa oggetto e messaggio.");
      return;
    }
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setNotice(data.error || "Errore invio.");
      return;
    }
    setSubject("");
    setMessage("");
    setNotice("Ticket inviato.");
    refresh();
    if (data.ticket?.id) setSelectedId(data.ticket.id);
  };

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    const res = await fetch(`/api/tickets/${selected.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ body: reply.trim() }),
    });
    if (res.ok) {
      setReply("");
      setNotice("Messaggio inviato.");
      refresh();
    } else {
      const e = await res.json().catch(() => ({}));
      setNotice(e.error || "Errore invio risposta.");
    }
  };

  const closeMine = async (id) => {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "Closed" }),
    });
    if (res.ok) refresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <AuthGate requirePremium>
          <section className="grid gap-8 lg:grid-cols-[1fr,1.1fr]">
            <div className="rounded-2xl border border-white/10 bg-[#111111]/90 p-8 shadow-[0_0_60px_rgba(124,58,237,0.08)]">
              <p className="text-sm uppercase tracking-[0.35em] text-violet-300/80">{t("support")}</p>
              <h1 className="mt-3 text-4xl font-black text-white">{t("supportTitle")}</h1>
              <p className="mt-4 text-white/60">{t("supportCopy")}</p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-4">
                <label className="block text-sm font-medium text-white/70">{t("askQuestion")}</label>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Es. Setup Monaco troppo instabile"
                />
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-4 text-white outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Descrivi circuito, problema e stile di guida..."
                />
                {notice ? <p className="text-sm text-violet-200">{notice}</p> : null}
                <button
                  type="submit"
                  className="inline-flex rounded-xl bg-violet-500 px-6 py-3 text-sm font-black uppercase tracking-[0.22em] text-white transition hover:bg-violet-400"
                >
                  {t("submitTicket")}
                </button>
              </form>
            </div>

            <div className="flex min-h-[420px] flex-col rounded-2xl border border-white/10 bg-[#111111]/90 p-6 shadow-[0_0_60px_rgba(124,58,237,0.08)]">
              <p className="text-sm uppercase tracking-[0.35em] text-violet-300/80">{t("activeTickets")}</p>
              <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
                <div className="max-h-[480px] space-y-2 overflow-y-auto lg:w-[42%]">
                  {tickets.length === 0 ? (
                    <p className="text-sm text-white/45">Nessun ticket ancora.</p>
                  ) : (
                    tickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(ticket.id);
                          setNotice("");
                        }}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                          selectedId === ticket.id ? "border-violet-400/60 bg-violet-500/12" : "border-white/10 bg-[#0f0f0f] hover:border-white/20"
                        }`}
                      >
                        <p className="font-semibold text-white">{ticket.subject}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-white/45">{ticket.message}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-wider text-violet-300/80">{ticket.status}</p>
                      </button>
                    ))
                  )}
                </div>

                <div className="min-h-[280px] flex-1 rounded-xl border border-white/10 bg-[#0c0c0c] p-4">
                  {!selected ? (
                    <p className="text-sm text-white/45">Seleziona un ticket per vedere la conversazione.</p>
                  ) : (
                    <div className="flex h-full flex-col">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <p className="font-bold text-white">{selected.subject}</p>
                          <p className="text-xs text-white/40">{selected.email}</p>
                        </div>
                        <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs text-violet-100">{selected.status}</span>
                      </div>
                      <div className="max-h-[220px] flex-1 space-y-3 overflow-y-auto pr-1">
                        <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
                          <p className="text-xs font-bold uppercase text-white/40">Tu — messaggio iniziale</p>
                          <p className="mt-2 text-sm text-white/75">{selected.message}</p>
                        </div>
                        {(selected.replies || []).map((r) => (
                          <div
                            key={r.id}
                            className={`rounded-lg border p-3 ${
                              r.author === "admin"
                                ? "border-amber-500/25 bg-amber-500/8"
                                : "border-white/8 bg-white/[0.03]"
                            }`}
                          >
                            <p className="text-xs font-bold uppercase text-white/40">
                              {r.author === "admin" ? "Staff MySetups" : "Tu"} — {new Date(r.at).toLocaleString("it-IT")}
                            </p>
                            <p className="mt-2 text-sm text-white/80">{r.body}</p>
                          </div>
                        ))}
                      </div>
                      {selected.status === "Open" ? (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={3}
                            placeholder="Scrivi un aggiornamento o una domanda di seguito…"
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/50"
                          />
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={sendReply}
                              className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-bold text-white hover:bg-violet-400"
                            >
                              Invia messaggio
                            </button>
                            <button
                              type="button"
                              onClick={() => closeMine(selected.id)}
                              className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                            >
                              Chiudi ticket
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-4 text-xs text-white/40">Ticket chiuso. Aprine uno nuovo per altre domande.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </AuthGate>
      </main>
      <Footer />
    </div>
  );
}
