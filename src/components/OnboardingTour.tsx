"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Tour step definitions ───────────────────────────────────────────────────

type TourStep = {
  title: string;
  description: string;
  target: string | null; // data-tour attribute value, null = centered modal
  targetDesktop?: string; // optional separate target for desktop
  buttonLabel: string;
};

const STEPS: TourStep[] = [
  {
    title: "Bienvenue sur nid.local!",
    description:
      "Le forum immobilier qu\u00e9b\u00e9cois. D\u00e9couvrez les discussions de votre quartier, explorez les outils financiers et publiez vos questions.",
    target: null,
    buttonLabel: "Commencer le tour",
  },
  {
    title: "Le fil de discussions",
    description:
      "Retrouvez ici toutes les discussions de votre ville et quartier\u00a0: questions, ventes, r\u00e9novations et plus encore.",
    target: "posts",
    buttonLabel: "Suivant",
  },
  {
    title: "Les outils",
    description:
      "Calculatrices hypoth\u00e9caires, estimation de capacit\u00e9 d\u2019emprunt, donn\u00e9es de march\u00e9\u2026 tout pour vos d\u00e9cisions immobili\u00e8res.",
    target: "outils",
    targetDesktop: "outils-desktop",
    buttonLabel: "Suivant",
  },
  {
    title: "Publiez votre premier post!",
    description:
      "Posez une question, partagez un conseil ou signalez un \u00e9v\u00e9nement dans votre quartier. La communaut\u00e9 est l\u00e0 pour vous aider.",
    target: "publier-mobile",
    targetDesktop: "publier-desktop",
    buttonLabel: "Terminer",
  },
];

const STORAGE_KEY = "onboarding_done";

// ─── Component ───────────────────────────────────────────────────────────────

export function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Check localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
        // Small delay so the page is rendered and target elements exist
        const timer = setTimeout(() => setActive(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  const next = useCallback(() => {
    if (step >= STEPS.length - 1) {
      finish();
    } else {
      setStep((s) => s + 1);
    }
  }, [step, finish]);

  // ─── Position the tooltip relative to the target element ─────────────────

  const positionTooltip = useCallback(() => {
    const current = STEPS[step];
    if (!current) return;

    // Center modal (step 0)
    if (current.target === null) {
      setSpotlightStyle({ display: "none" });
      setArrowStyle({ display: "none" });
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
      return;
    }

    // Determine if desktop (md breakpoint = 768px)
    const isDesktop = window.innerWidth >= 768;
    const targetAttr = isDesktop && current.targetDesktop ? current.targetDesktop : current.target;
    const el = document.querySelector(`[data-tour="${targetAttr}"]`) as HTMLElement | null;

    if (!el) {
      // Fallback: center the tooltip if target not found
      setSpotlightStyle({ display: "none" });
      setArrowStyle({ display: "none" });
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
      return;
    }

    const rect = el.getBoundingClientRect();
    const pad = 8; // padding around the spotlight
    const tooltipMaxW = 300;
    const tooltipEl = tooltipRef.current;
    const tooltipH = tooltipEl ? tooltipEl.offsetHeight : 200;
    const gap = 12; // gap between spotlight and tooltip

    // Spotlight rect
    const sLeft = rect.left - pad;
    const sTop = rect.top - pad;
    const sWidth = rect.width + pad * 2;
    const sHeight = rect.height + pad * 2;

    setSpotlightStyle({
      position: "fixed",
      left: sLeft,
      top: sTop,
      width: sWidth,
      height: sHeight,
      borderRadius: 12,
      display: "block",
    });

    // Tooltip positioning
    let tLeft: number;
    let tTop: number;
    let aDir: "up" | "down" | "left" | "right" = "up";

    if (!isDesktop) {
      // Mobile: always position below or above the target
      tLeft = Math.max(12, Math.min(window.innerWidth - tooltipMaxW - 12, rect.left + rect.width / 2 - tooltipMaxW / 2));

      if (rect.bottom + gap + tooltipH + 60 < window.innerHeight) {
        // Below
        tTop = rect.bottom + pad + gap;
        aDir = "up";
      } else {
        // Above
        tTop = rect.top - pad - gap - tooltipH;
        aDir = "down";
      }
    } else {
      // Desktop: prefer to the side if there's room, else below/above
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;

      if (spaceRight > tooltipMaxW + gap + pad + 20) {
        // Right of the target
        tLeft = rect.right + pad + gap;
        tTop = rect.top + rect.height / 2 - tooltipH / 2;
        tTop = Math.max(12, Math.min(window.innerHeight - tooltipH - 12, tTop));
        aDir = "left";
      } else if (spaceLeft > tooltipMaxW + gap + pad + 20) {
        // Left of the target
        tLeft = rect.left - pad - gap - tooltipMaxW;
        tTop = rect.top + rect.height / 2 - tooltipH / 2;
        tTop = Math.max(12, Math.min(window.innerHeight - tooltipH - 12, tTop));
        aDir = "right";
      } else {
        // Below / above
        tLeft = Math.max(12, Math.min(window.innerWidth - tooltipMaxW - 12, rect.left + rect.width / 2 - tooltipMaxW / 2));
        if (rect.bottom + gap + tooltipH + 20 < window.innerHeight) {
          tTop = rect.bottom + pad + gap;
          aDir = "up";
        } else {
          tTop = rect.top - pad - gap - tooltipH;
          aDir = "down";
        }
      }
    }

    setTooltipStyle({
      position: "fixed",
      left: tLeft,
      top: tTop,
    });

    // Arrow positioning
    const arrowSize = 8;
    const arrowBase: React.CSSProperties = {
      position: "absolute",
      width: 0,
      height: 0,
      display: "block",
    };

    if (aDir === "up") {
      // Arrow points up, sits on top of tooltip
      Object.assign(arrowBase, {
        top: -arrowSize,
        left: "50%",
        marginLeft: -arrowSize,
        borderLeft: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid var(--bg-card)`,
      });
    } else if (aDir === "down") {
      Object.assign(arrowBase, {
        bottom: -arrowSize,
        left: "50%",
        marginLeft: -arrowSize,
        borderLeft: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid transparent`,
        borderTop: `${arrowSize}px solid var(--bg-card)`,
      });
    } else if (aDir === "left") {
      Object.assign(arrowBase, {
        left: -arrowSize,
        top: "50%",
        marginTop: -arrowSize,
        borderTop: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid var(--bg-card)`,
      });
    } else if (aDir === "right") {
      Object.assign(arrowBase, {
        right: -arrowSize,
        top: "50%",
        marginTop: -arrowSize,
        borderTop: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid transparent`,
        borderLeft: `${arrowSize}px solid var(--bg-card)`,
      });
    }

    setArrowStyle(arrowBase);
  }, [step]);

  // Reposition on step change, resize, scroll
  useEffect(() => {
    if (!active) return;

    positionTooltip();

    const handleUpdate = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(positionTooltip);
    };

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, step, positionTooltip]);

  if (!active) return null;

  const current = STEPS[step];
  const isCenter = current.target === null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "none",
      }}
    >
      {/* Clickable backdrop — always present for dismissing on click */}
      <div
        onClick={finish}
        style={{
          position: "fixed",
          inset: 0,
          background: spotlightStyle.display === "none" ? "rgba(0,0,0,0.6)" : "transparent",
          pointerEvents: "auto",
          transition: "background 0.3s",
        }}
      />

      {/* Spotlight cutout — creates its own overlay via giant box-shadow */}
      {spotlightStyle.display !== "none" && (
        <div
          style={{
            ...spotlightStyle,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
            pointerEvents: "none",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          ...tooltipStyle,
          maxWidth: 300,
          width: isCenter ? 300 : undefined,
          pointerEvents: "auto",
          zIndex: 100000,
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Arrow */}
        {!isCenter && <div style={arrowStyle} />}

        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 12,
            padding: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            border: "0.5px solid var(--border)",
          }}
        >
          {/* Step title */}
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              margin: 0,
              color: "var(--text-primary)",
              lineHeight: 1.3,
            }}
          >
            {current.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              margin: "8px 0 16px",
              lineHeight: 1.5,
            }}
          >
            {current.description}
          </p>

          {/* Step dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 6,
              marginBottom: 14,
            }}
          >
            {STEPS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === step ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === step ? "var(--green)" : "var(--border-secondary)",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            {/* Passer link — hidden on first step and last step */}
            {step > 0 && step < STEPS.length - 1 ? (
              <button
                onClick={finish}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  padding: "4px 0",
                }}
              >
                Passer
              </button>
            ) : (
              <span />
            )}

            {/* Primary button */}
            <button
              onClick={next}
              style={{
                background: "var(--green)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 18px",
                borderRadius: 8,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {current.buttonLabel}
            </button>
          </div>

          {/* Step counter */}
          {!isCenter && (
            <p
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "var(--text-tertiary)",
                margin: "10px 0 0",
              }}
            >
              {step + 1}/{STEPS.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
