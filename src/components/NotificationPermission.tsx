"use client";

import { useState, useEffect } from "react";

export function NotificationPermission() {
  // Désactivé temporairement
  return null;

  // eslint-disable-next-line no-unreachable
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if Notification API is supported and permission not yet decided
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      Notification.permission !== "default"
    ) {
      return;
    }

    // Don't show if user already dismissed the banner
    const dismissed = localStorage.getItem("notif-banner-dismissed");
    if (dismissed === "true") return;

    setVisible(true);
  }, []);

  async function handleActivate() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      localStorage.setItem("notif-permission", "granted");
    }
    setVisible(false);
  }

  function handleDismiss() {
    localStorage.setItem("notif-banner-dismissed", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-2.5 rounded-xl"
      style={{
        background: "var(--green-light-bg)",
        border: "0.5px solid var(--border)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        maxWidth: 400,
        width: "calc(100% - 24px)",
      }}
    >
      <svg
        className="w-4 h-4 flex-shrink-0"
        style={{ color: "var(--green)" }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <p
        className="text-[12px] leading-snug flex-1"
        style={{ color: "var(--green-text)" }}
      >
        Activer les notifications pour ne rien manquer
      </p>
      <button
        onClick={handleActivate}
        className="text-[11px] font-semibold px-3 py-1 rounded-lg flex-shrink-0 transition-opacity hover:opacity-80"
        style={{
          background: "var(--green)",
          color: "#ffffff",
        }}
      >
        Activer
      </button>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 transition-opacity hover:opacity-60"
        style={{ color: "var(--text-tertiary)" }}
        aria-label="Fermer"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
