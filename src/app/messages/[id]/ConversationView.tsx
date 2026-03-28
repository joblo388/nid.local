"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";

type Msg = {
  id: string;
  contenu: string;
  auteurId: string;
  auteurUsername: string;
  auteurImage: string | null;
  isMine: boolean;
  creeLe: string;
};

type ConvInfo = {
  id: string;
  other: { id: string; username: string; image: string | null };
  listing: { id: string; titre: string; prix: number } | null;
};

export function ConversationView() {
  const params = useParams();
  const id = params.id as string;
  const bottomRef = useRef<HTMLDivElement>(null);

  const [conv, setConv] = useState<ConvInfo | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/conversations/${id}/messages`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setConv(data.conversation);
          setMessages(data.messages);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/conversations/${id}/messages`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error && data.messages) setMessages(data.messages);
        })
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMsg.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu: newMsg }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data]);
        setNewMsg("");
      }
    } catch { /* ignore */ }
    setSending(false);
  }

  function formatTime(d: string) {
    const date = new Date(d);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return date.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString("fr-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  if (loading) {
    return <><Header /><div className="text-center py-20 text-[13px]" style={{ color: "var(--text-tertiary)" }}>Chargement...</div></>;
  }

  if (!conv) {
    return <><Header /><div className="text-center py-20"><div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Conversation introuvable</div><Link href="/messages" style={{ color: "var(--green)", fontSize: 13 }}>Retour aux messages</Link></div></>;
  }

  return (
    <>
      <Header />
      <div className="max-w-[600px] mx-auto flex flex-col" style={{ height: "calc(100vh - 52px - 60px)" }}>
        {/* Conversation header */}
        <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <Link href="/messages" className="text-[13px] shrink-0" style={{ color: "var(--text-tertiary)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7" /></svg>
          </Link>
          {conv.other.image ? (
            <Image src={conv.other.image} alt="" width={36} height={36} className="rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0" style={{ background: "var(--green)" }}>
              {conv.other.username[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{conv.other.username}</p>
            {conv.listing && (
              <Link href={`/annonces/${conv.listing.id}`} className="text-[11px] truncate block" style={{ color: "var(--green-text)" }}>
                {conv.listing.prix.toLocaleString("fr-CA")} $ — {conv.listing.titre}
              </Link>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: "var(--bg-page)" }}>
          {messages.length === 0 && (
            <div className="text-center py-8 text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              Début de la conversation. Envoyez un message.
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isMine ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[75%] rounded-2xl px-3.5 py-2.5"
                style={m.isMine
                  ? { background: "var(--green)", color: "white", borderBottomRightRadius: 4 }
                  : { background: "var(--bg-card)", border: "0.5px solid var(--border)", color: "var(--text-primary)", borderBottomLeftRadius: 4 }
                }
              >
                {!m.isMine && (
                  <p className="text-[11px] font-medium mb-0.5" style={{ color: "var(--green-text)" }}>{m.auteurUsername}</p>
                )}
                <p className="text-[13px] leading-relaxed" style={{ whiteSpace: "pre-wrap" }}>{m.contenu}</p>
                <p className="text-[10px] mt-1" style={{ opacity: 0.6 }}>{formatTime(m.creeLe)}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 shrink-0" style={{ background: "var(--bg-card)", borderTop: "0.5px solid var(--border)" }}>
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 px-3.5 py-2.5 rounded-full text-[13px] outline-none"
            style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", color: "var(--text-primary)" }}
          />
          <button
            type="submit"
            disabled={sending || !newMsg.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40"
            style={{ background: "var(--green)", border: "none", cursor: "pointer" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </form>
      </div>
    </>
  );
}
