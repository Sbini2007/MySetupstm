"use client";

import { useEffect, useState, useCallback } from "react";
import { Send, PlusCircle } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AuthGate from "@/components/AuthGate";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setNotice("Completa oggetto e messaggio prima di inviare.");
      return;
    }
    setIsSubmitting(true);
    setNotice("");
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error || "Errore invio ticket.");
        return;
      }
      setSubject("");
      setMessage("");
      setNotice("Ticket inviato.");
      refresh();
      if (data.ticket?.id) setSelectedId(data.ticket.id);
    } catch {
      setNotice("Errore di connessione.");
    } finally {
      setIsSubmitting(false);
    }
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
      setNotice("Risposta inviata.");
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
    <div className="min-h-screen bg-[#07070a] text-zinc-100">
      <NavBar />
      <AuthGate requirePremium>
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6">
          <div className="mb-8">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
              Assistenza Tecnica
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Supporto Assetti
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Hai bisogno di consigli su uno stile di guida o modifiche per il tuo volante? Contattaci direttamente.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            {/* Create Ticket */}
            <div className="rounded-xl border border-white/[0.08] bg-[#0c0c10] p-6 lg:col-span-5">
              <h2 className="text-sm font-semibold text-white">Nuova Richiesta</h2>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Oggetto</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Es. Sottosterzo in curva 1 Monza"
                    className="w-full rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-white/20"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Messaggio</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Descrivi la periferica usata (volante/pad) e le sensazioni in pista..."
                    className="w-full rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-white/20"
                  />
                </div>

                {notice && <p className="text-xs text-violet-300">{notice}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-white py-2 text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
                >
                  {isSubmitting ? "Invio..." : "Invia Richiesta"}
                </button>
              </form>
            </div>

            {/* Ticket List and Messages */}
            <div className="rounded-xl border border-white/[0.08] bg-[#0c0c10] p-6 lg:col-span-7">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-xs font-semibold text-white">
                  I Tuoi Ticket ({tickets.length})
                </span>
              </div>

              {tickets.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  Nessun ticket attivo.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {tickets.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedId(t.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs text-left transition ${
                          selectedId === t.id
                            ? "bg-white/[0.12] text-white"
                            : "border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="font-medium truncate block max-w-[140px]">{t.subject}</span>
                      </button>
                    ))}
                  </div>

                  {selected && (
                    <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/30 p-4 text-xs space-y-3">
                      <div>
                        <span className="font-semibold text-white block">{selected.subject}</span>
                        <p className="mt-1 text-zinc-300">{selected.message}</p>
                      </div>

                      {(selected.replies || []).map((r) => (
                        <div key={r.id} className="rounded border border-white/[0.05] bg-white/[0.02] p-2.5">
                          <span className="text-[10px] text-zinc-500 block">
                            {r.author === "admin" ? "Staff MySetups" : "Tu"}
                          </span>
                          <p className="mt-0.5 text-zinc-300">{r.body}</p>
                        </div>
                      ))}

                      {selected.status === "Open" && (
                        <div className="pt-2 border-t border-white/[0.05] flex gap-2">
                          <input
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Scrivi una risposta..."
                            className="flex-1 rounded-md border border-white/[0.08] bg-black/40 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={sendReply}
                            className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200"
                          >
                            Invia
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </AuthGate>
      <Footer />
    </div>
  );
}
