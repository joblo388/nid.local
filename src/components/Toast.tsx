"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  exiting: boolean;
};

type ToastFn = (opts: { message: string; type?: ToastType }) => void;

// ─── Context ────────────────────────────────────────────────────────────────

const ToastContext = createContext<{ toast: ToastFn } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// ─── Color map ──────────────────────────────────────────────────────────────

const borderColors: Record<ToastType, string> = {
  success: "var(--green)",
  error: "var(--red-text)",
  info: "var(--blue-text)",
};

// ─── Provider + Display ─────────────────────────────────────────────────────

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 3000;
const EXIT_DURATION_MS = 300;

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Schedule auto-dismiss for a toast
  const scheduleDismiss = useCallback((id: string) => {
    const timer = setTimeout(() => {
      // Start exit animation
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      // Remove after animation
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        timersRef.current.delete(id);
      }, EXIT_DURATION_MS);
    }, AUTO_DISMISS_MS);
    timersRef.current.set(id, timer);
  }, []);

  // Close a toast manually
  const closeToast = useCallback((id: string) => {
    const existing = timersRef.current.get(id);
    if (existing) clearTimeout(existing);
    timersRef.current.delete(id);

    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_DURATION_MS);
  }, []);

  // The toast() function exposed via context
  const toast: ToastFn = useCallback(
    ({ message, type = "success" }) => {
      const id = `toast-${++idCounter}`;
      const item: ToastItem = { id, message, type, exiting: false };

      setToasts((prev) => {
        // If at max, evict the oldest
        const next = prev.length >= MAX_TOASTS ? prev.slice(1) : [...prev];
        return [...next, item];
      });

      scheduleDismiss(id);
    },
    [scheduleDismiss]
  );

  // Clean up all timers on unmount
  useEffect(() => {
    const t = timersRef.current;
    return () => {
      t.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            pointerEvents: "none",
          }}
          className="toast-container-desktop"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              style={{
                pointerEvents: "auto",
                maxWidth: "360px",
                width: "max-content",
                minWidth: "220px",
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
                borderLeft: `3px solid ${borderColors[t.type]}`,
                borderRadius: "8px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                fontSize: "13px",
                color: "var(--text-primary)",
                opacity: t.exiting ? 0 : 1,
                transform: t.exiting ? "translateY(12px)" : "translateY(0)",
                transition: `opacity ${EXIT_DURATION_MS}ms ease, transform ${EXIT_DURATION_MS}ms ease`,
                animation: t.exiting ? "none" : "toast-slide-up 300ms ease forwards",
              }}
            >
              <span>{t.message}</span>
              <button
                onClick={() => closeToast(t.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-tertiary)",
                  fontSize: "14px",
                  lineHeight: 1,
                  padding: "2px 4px",
                  flexShrink: 0,
                }}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Keyframe + responsive override */}
      <style>{`
        @keyframes toast-slide-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (min-width: 768px) {
          .toast-container-desktop {
            bottom: 24px !important;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
