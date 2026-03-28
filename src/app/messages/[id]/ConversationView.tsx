"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { TypingIndicator } from "@/components/TypingIndicator";

type Msg = {
  id: string;
  contenu: string;
  auteurId: string;
  auteurUsername: string;
  auteurImage: string | null;
  isMine: boolean;
  creeLe: string;
};

type OptimisticMsg = Msg & {
  _status?: "sending" | "failed";
  _tempId?: string;
};

type ConvInfo = {
  id: string;
  other: { id: string; username: string; image: string | null };
  listing: { id: string; titre: string; prix: number } | null;
};

/* ------------------------------------------------------------------ */
/*  Web Audio API beep — short, subtle notification tone              */
/* ------------------------------------------------------------------ */
function playNotificationBeep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
    // Clean up context after sound finishes
    setTimeout(() => ctx.close().catch(() => {}), 300);
  } catch {
    // Audio not available — ignore
  }
}

export function ConversationView() {
  const params = useParams();
  const id = params.id as string;
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [conv, setConv] = useState<ConvInfo | null>(null);
  const [messages, setMessages] = useState<OptimisticMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [showNewMsgPill, setShowNewMsgPill] = useState(false);
  const lastTypingRef = useRef(0);
  const prevMsgCountRef = useRef(0);
  const userScrolledUpRef = useRef(false);

  /* ---------------------------------------------------------------- */
  /*  Track if user has scrolled up from bottom                       */
  /* ---------------------------------------------------------------- */
  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const threshold = 80;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    userScrolledUpRef.current = !isAtBottom;
    if (isAtBottom) setShowNewMsgPill(false);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Scroll to bottom helper                                        */
  /* ---------------------------------------------------------------- */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
    setShowNewMsgPill(false);
    userScrolledUpRef.current = false;
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Typing notification                                             */
  /* ---------------------------------------------------------------- */
  const notifyTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastTypingRef.current < 2000) return;
    lastTypingRef.current = now;
    fetch(`/api/conversations/${id}/typing`, { method: "POST" }).catch(() => {});
  }, [id]);

  /* ---------------------------------------------------------------- */
  /*  Initial load                                                    */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    fetch(`/api/conversations/${id}/messages`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setConv(data.conversation);
          setMessages(data.messages);
          prevMsgCountRef.current = data.messages.length;
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* Scroll to bottom on initial load */
  useEffect(() => {
    if (!loading && messages.length > 0) {
      // Use instant scroll on initial load
      setTimeout(() => scrollToBottom("instant"), 50);
    }
    // Only on initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  /* ---------------------------------------------------------------- */
  /*  Adaptive polling: 3s visible, 15s hidden                       */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let isTabVisible = !document.hidden;

    function startPolling(intervalMs: number) {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        fetch(`/api/conversations/${id}/messages`)
          .then((r) => r.json())
          .then((data) => {
            if (!data.error && data.messages) {
              const serverMsgs: Msg[] = data.messages;
              const serverIds = new Set(serverMsgs.map((m) => m.id));

              setMessages((prev) => {
                // Keep optimistic messages that server hasn't confirmed yet
                const optimistic = prev.filter(
                  (m) => m._tempId && !serverIds.has(m.id) && m._status === "sending"
                );
                const merged = [...serverMsgs, ...optimistic];

                // Detect new messages from the other person
                const prevConfirmedCount = prev.filter((m) => !m._tempId).length;
                const newFromOther = serverMsgs.filter(
                  (m) => !m.isMine && !prev.some((p) => p.id === m.id)
                );

                if (newFromOther.length > 0 && prevConfirmedCount > 0) {
                  // Play beep if tab is visible
                  if (!document.hidden) {
                    playNotificationBeep();
                  }
                  // Show pill if user scrolled up
                  if (userScrolledUpRef.current) {
                    setShowNewMsgPill(true);
                  } else {
                    // Auto-scroll to new message
                    setTimeout(() => scrollToBottom("smooth"), 50);
                  }
                }

                prevMsgCountRef.current = serverMsgs.length;
                return merged;
              });
            }
          })
          .catch(() => {});
      }, intervalMs);
    }

    function handleVisibilityChange() {
      isTabVisible = !document.hidden;
      startPolling(isTabVisible ? 3000 : 15000);
    }

    // Start with appropriate interval
    startPolling(isTabVisible ? 3000 : 15000);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [id, scrollToBottom]);

  /* ---------------------------------------------------------------- */
  /*  Auto-grow textarea                                              */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const lineHeight = 20;
    const maxLines = 5;
    const maxHeight = lineHeight * maxLines;
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + "px";
    ta.style.overflowY = ta.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [newMsg]);

  /* ---------------------------------------------------------------- */
  /*  Send message with optimistic update                             */
  /* ---------------------------------------------------------------- */
  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = newMsg.trim();
    if (!text || sending) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMsg: OptimisticMsg = {
      id: tempId,
      contenu: text,
      auteurId: "me",
      auteurUsername: "",
      auteurImage: null,
      isMine: true,
      creeLe: new Date().toISOString(),
      _status: "sending",
      _tempId: tempId,
    };

    // Show message immediately
    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMsg("");
    setSending(true);

    // Scroll to bottom for own messages
    setTimeout(() => scrollToBottom("smooth"), 50);

    try {
      const res = await fetch(`/api/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu: text }),
      });
      const data = await res.json();
      if (res.ok) {
        // Replace optimistic message with confirmed one
        setMessages((prev) =>
          prev.map((m) => (m._tempId === tempId ? { ...data } : m))
        );
      } else {
        // Mark as failed
        setMessages((prev) =>
          prev.map((m) =>
            m._tempId === tempId ? { ...m, _status: "failed" } : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m._tempId === tempId ? { ...m, _status: "failed" } : m
        )
      );
    }
    setSending(false);
  }

  /* ---------------------------------------------------------------- */
  /*  Retry failed message                                            */
  /* ---------------------------------------------------------------- */
  async function handleRetry(tempId: string) {
    const msg = messages.find((m) => m._tempId === tempId);
    if (!msg) return;

    // Set back to sending
    setMessages((prev) =>
      prev.map((m) =>
        m._tempId === tempId ? { ...m, _status: "sending" } : m
      )
    );

    try {
      const res = await fetch(`/api/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu: msg.contenu }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m._tempId === tempId ? { ...data } : m))
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m._tempId === tempId ? { ...m, _status: "failed" } : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m._tempId === tempId ? { ...m, _status: "failed" } : m
        )
      );
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Handle keyboard events in textarea                              */
  /* ---------------------------------------------------------------- */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Format time                                                     */
  /* ---------------------------------------------------------------- */
  function formatTime(d: string) {
    const date = new Date(d);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return date.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString("fr-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */
  if (loading) {
    return <><Header /><div className="text-center py-20 text-[13px]" style={{ color: "var(--text-tertiary)" }}>Chargement...</div></>;
  }

  if (!conv) {
    return <><Header /><div className="text-center py-20"><div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Conversation introuvable</div><Link href="/messages" style={{ color: "var(--green)", fontSize: 13 }}>Retour aux messages</Link></div></>;
  }

  const charCount = newMsg.length;

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
            <Image src={conv.other.image} alt="" width={36} height={36} className="rounded-full object-cover shrink-0" loading="lazy" />
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

        {/* Messages area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 relative"
          style={{ background: "var(--bg-page)" }}
        >
          {messages.length === 0 && (
            <div className="text-center py-8 text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              Début de la conversation. Envoyez un message.
            </div>
          )}
          {messages.map((m) => (
            <div key={m._tempId || m.id} className={`flex ${m.isMine ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[75%] rounded-2xl px-3.5 py-2.5"
                style={{
                  ...(m.isMine
                    ? { background: "var(--green)", color: "white", borderBottomRightRadius: 4 }
                    : { background: "var(--bg-card)", border: "0.5px solid var(--border)", color: "var(--text-primary)", borderBottomLeftRadius: 4 }),
                  ...(m._status === "sending" ? { opacity: 0.7 } : {}),
                  ...(m._status === "failed" ? { opacity: 0.8 } : {}),
                }}
              >
                {!m.isMine && (
                  <p className="text-[11px] font-medium mb-0.5" style={{ color: "var(--green-text)" }}>{m.auteurUsername}</p>
                )}
                <p className="text-[13px] leading-relaxed" style={{ whiteSpace: "pre-wrap" }}>{m.contenu}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {/* Time */}
                  <p className="text-[10px]" style={{ opacity: 0.6 }}>{formatTime(m.creeLe)}</p>
                  {/* Sending indicator */}
                  {m._status === "sending" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.6 }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  )}
                  {/* Failed indicator */}
                  {m._status === "failed" && (
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                      <button
                        onClick={() => m._tempId && handleRetry(m._tempId)}
                        className="text-[10px] underline"
                        style={{ color: "rgba(255,255,255,0.9)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        Réessayer
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <TypingIndicator conversationId={id} />
          <div ref={bottomRef} />
        </div>

        {/* New message pill */}
        {showNewMsgPill && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => scrollToBottom("smooth")}
              className="text-[12px] font-medium px-4 py-1.5 rounded-full"
              style={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--green)",
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                zIndex: 10,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                Nouveau message
              </span>
            </button>
          </div>
        )}

        {/* Input area */}
        <form onSubmit={handleSend} className="flex items-end gap-2 px-4 py-3 shrink-0" style={{ background: "var(--bg-card)", borderTop: "0.5px solid var(--border)" }}>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMsg}
              onChange={(e) => { setNewMsg(e.target.value); if (e.target.value.trim()) notifyTyping(); }}
              onKeyDown={handleKeyDown}
              placeholder="Écrire un message..."
              rows={1}
              className="w-full px-3.5 py-2.5 rounded-2xl text-[13px] outline-none resize-none"
              style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border)",
                color: "var(--text-primary)",
                lineHeight: "20px",
                maxHeight: 100,
              }}
            />
            {charCount > 400 && (
              <span
                className="text-[10px] absolute"
                style={{
                  right: 12,
                  bottom: 6,
                  color: charCount > 900 ? "var(--red-text)" : "var(--text-tertiary)",
                }}
              >
                {charCount}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={sending || !newMsg.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40"
            style={{ background: "var(--green)", border: "none", cursor: "pointer", marginBottom: 1 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </form>
      </div>
    </>
  );
}
