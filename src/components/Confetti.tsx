"use client";

import { createContext, useContext, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ── Palette ─────────────────────────────────────────────────────────────── */
const COLORS = ["#1D9E75", "#185FA5", "#854F0B", "#A32D2D", "#f5f4f0"];

/* ── Types ───────────────────────────────────────────────────────────────── */
type ConfettiPiece = {
  id: number;
  color: string;
  left: number;      // % from left
  size: number;      // px
  duration: number;  // s  (fall speed)
  delay: number;     // s
  drift: number;     // px (horizontal oscillation amplitude)
  rotation: number;  // deg initial rotation
  rotationEnd: number;
};

type ConfettiContextValue = {
  celebrate: () => void;
};

/* ── Context ─────────────────────────────────────────────────────────────── */
const ConfettiContext = createContext<ConfettiContextValue>({ celebrate: () => {} });

export function useConfetti() {
  return useContext(ConfettiContext);
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

let nextId = 0;

function makePieces(): ConfettiPiece[] {
  const count = Math.floor(rand(50, 80));
  return Array.from({ length: count }, () => ({
    id: nextId++,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    left: rand(0, 100),
    size: rand(6, 10),
    duration: rand(1, 3),
    delay: rand(0, 0.5),
    drift: rand(-40, 40),
    rotation: rand(0, 360),
    rotationEnd: rand(0, 360) + 360 * (Math.random() > 0.5 ? 1 : -1),
  }));
}

/* ── Provider ────────────────────────────────────────────────────────────── */
export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const celebrate = useCallback(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;
    }

    // Prevent stacking — clear any running burst
    if (timerRef.current) clearTimeout(timerRef.current);

    const newPieces = makePieces();
    setPieces(newPieces);

    // Auto-clean after 3s
    timerRef.current = setTimeout(() => {
      setPieces([]);
      timerRef.current = null;
    }, 3000);
  }, []);

  return (
    <ConfettiContext.Provider value={{ celebrate }}>
      {children}
      {pieces.length > 0 && typeof document !== "undefined" &&
        createPortal(
          <div aria-hidden="true" className="confetti-container">
            {pieces.map((p) => (
              <div
                key={p.id}
                className="confetti-piece"
                style={{
                  left: `${p.left}%`,
                  width: p.size,
                  height: p.size * 0.6,
                  backgroundColor: p.color,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  "--confetti-drift": `${p.drift}px`,
                  "--confetti-rot-start": `${p.rotation}deg`,
                  "--confetti-rot-end": `${p.rotationEnd}deg`,
                } as React.CSSProperties}
              />
            ))}
          </div>,
          document.body,
        )}
    </ConfettiContext.Provider>
  );
}
