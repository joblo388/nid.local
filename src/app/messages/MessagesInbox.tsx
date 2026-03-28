"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";

type ConvItem = {
  id: string;
  other: { id: string; username: string; image: string | null };
  listing: { id: string; titre: string; prix: number } | null;
  lastMsg: string | null;
  lastMsgAt: string;
  unread: number;
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}j`;
  return new Date(d).toLocaleDateString("fr-CA", { month: "short", day: "numeric" });
}

export function MessagesInbox() {
  const [conversations, setConversations] = useState<ConvItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((data) => setConversations(data.conversations ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-[600px] mx-auto px-3 md:px-5 py-4 md:py-6">
        <h1 className="text-[20px] font-bold mb-4" style={{ color: "var(--text-primary)" }}>Messages</h1>

        {loading ? (
          <div className="text-center py-16 text-[13px]" style={{ color: "var(--text-tertiary)" }}>Chargement...</div>
        ) : conversations.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
            <p className="text-[14px] mb-2" style={{ color: "var(--text-secondary)" }}>Aucune conversation</p>
            <p className="text-[13px] mb-4" style={{ color: "var(--text-tertiary)" }}>
              Contactez un propriétaire depuis une annonce pour démarrer une conversation.
            </p>
            <Link href="/annonces" className="inline-block text-[13px] font-semibold text-white px-4 py-2 rounded-lg" style={{ background: "var(--green)" }}>
              Voir les annonces
            </Link>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
            {conversations.map((c, i) => (
              <Link
                key={c.id}
                href={`/messages/${c.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover-bg"
                style={{ borderBottom: i < conversations.length - 1 ? "0.5px solid var(--border)" : "none" }}
              >
                {c.other.image ? (
                  <Image src={c.other.image} alt="" width={40} height={40} className="rounded-full object-cover shrink-0" loading="lazy" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-white shrink-0" style={{ background: "var(--green)" }}>
                    {c.other.username[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {c.other.username}
                    </span>
                    <span className="text-[11px] shrink-0" style={{ color: "var(--text-tertiary)" }}>{timeAgo(c.lastMsgAt)}</span>
                  </div>
                  {c.listing && (
                    <p className="text-[11px] truncate" style={{ color: "var(--green-text)" }}>
                      {c.listing.prix.toLocaleString("fr-CA")} $ — {c.listing.titre}
                    </p>
                  )}
                  <p className="text-[12px] truncate" style={{ color: c.unread > 0 ? "var(--text-primary)" : "var(--text-tertiary)", fontWeight: c.unread > 0 ? 500 : 400 }}>
                    {c.lastMsg ?? "..."}
                  </p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: "var(--green)" }}>
                    {c.unread}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
