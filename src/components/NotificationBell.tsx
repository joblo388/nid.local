"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Notification = {
  id: string;
  type: string;
  postId: string;
  postTitre: string;
  acteurNom: string;
  lu: boolean;
  creeLe: string;
};

function tempsRelatif(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.lu).length;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) setNotifications(await res.json());
    } catch {
      // silent
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleOpen() {
    setOpen(!open);
    if (!open && unread > 0) {
      // Mark all as read
      await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
    }
  }

  async function handleNotifClick(id: string, postId: string) {
    setOpen(false);
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, lu: true } : n));
    window.location.href = `/post/${postId}`;
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-opacity hover:opacity-70"
        style={{ color: "var(--text-tertiary)" }}
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white rounded-full"
            style={{ background: "var(--green)" }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-[320px] rounded-xl overflow-hidden z-50"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "0.5px solid var(--border)" }}
          >
            <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Notifications
            </span>
            {notifications.length > 0 && (
              <button
                onClick={async () => {
                  await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
                  setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
                }}
                className="text-[11px] transition-opacity hover:opacity-70"
                style={{ color: "var(--green)" }}
              >
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                Aucune notification
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotifClick(n.id, n.postId)}
                  className="w-full text-left px-4 py-3 transition-colors hover-bg"
                  style={{
                    background: n.lu ? "transparent" : "var(--green-light-bg)",
                    borderBottom: "0.5px solid var(--border)",
                  }}
                >
                  <p className="text-[12px] leading-snug" style={{ color: "var(--text-primary)" }}>
                    <span className="font-semibold">{n.acteurNom}</span>
                    {n.type === "comment" ? " a commenté votre post" : " a interagi avec votre post"}
                  </p>
                  <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-tertiary)" }}>
                    {n.postTitre}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                    {tempsRelatif(n.creeLe)}
                  </p>
                </button>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div style={{ borderTop: "0.5px solid var(--border)" }}>
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-center text-[12px] transition-opacity hover:opacity-70"
                style={{ color: "var(--green)" }}
              >
                Voir tout l&apos;historique
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
