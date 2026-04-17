"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale } from "@/lib/useLocale";

// ─── Tour step definitions ───────────────────────────────────────────────────

type TourStep = {
  titleKey: string;
  descKey: string;
  target: string | null;
  targetDesktop?: string;
  buttonKey: string;
};

const STEPS: TourStep[] = [
  {
    titleKey: "tour.welcome_title",
    descKey: "tour.welcome_desc",
    target: null,
    buttonKey: "tour.welcome_btn",
  },
  {
    titleKey: "tour.feed_title",
    descKey: "tour.feed_desc",
    target: "posts",
    buttonKey: "tour.next",
  },
  {
    titleKey: "tour.tools_title",
    descKey: "tour.tools_desc",
    target: "outils",
    targetDesktop: "outils-desktop",
    buttonKey: "tour.next",
  },
  {
    titleKey: "tour.publish_title",
    descKey: "tour.publish_desc",
    target: "publier-mobile",
    targetDesktop: "publier-desktop",
    buttonKey: "tour.finish",
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
  const { t } = useLocale();

  // Check localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
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

    const isDesktop = window.innerWidth >= 768;
    const targetAttr = isDesktop && current.targetDesktop ? current.targetDesktop : current.target;
    const el = document.querySelector(`[data-tour="${targetAttr}"]`) as HTMLElement | null;

    if (!el) {
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
    const pad = 8;
    const tooltipMaxW = 300;
    const tooltipEl = tooltipRef.current;
    const tooltipH = tooltipEl ? tooltipEl.offsetHeight : 200;
    const gap = 12;

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

    let tLeft: number;
    let tTop: number;
    let aDir: "up" | "down" | "left" | "right" = "up";

    if (!isDesktop) {
      tLeft = Math.max(12, Math.min(window.innerWidth - tooltipMaxW - 12, rect.left + rect.width / 2 - tooltipMaxW / 2));

      if (rect.bottom + gap + tooltipH + 60 < window.innerHeight) {
        tTop = rect.bottom + pad + gap;
        aDir = "up";
      } else {
        tTop = rect.top - pad - gap - tooltipH;
        aDir = "down";
      }
    } else {
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;

      if (spaceRight > tooltipMaxW + gap + pad + 20) {
        tLeft = rect.right + pad + gap;
        tTop = rect.top + rect.height / 2 - tooltipH / 2;
        tTop = Math.max(12, Math.min(window.innerHeight - tooltipH - 12, tTop));
        aDir = "left";
      } else if (spaceLeft > tooltipMaxW + gap + pad + 20) {
        tLeft = rect.left - pad - gap - tooltipMaxW;
        tTop = rect.top + rect.height / 2 - tooltipH / 2;
        tTop = Math.max(12, Math.min(window.innerHeight - tooltipH - 12, tTop));
        aDir = "right";
      } else {
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

    const arrowSize = 8;
    const arrowBase: React.CSSProperties = {
      position: "absolute",
      width: 0,
      height: 0,
      display: "block",
    };

    if (aDir === "up") {
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
    <>
      <div
        onClick={finish}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 99997,
        }}
      />

      {spotlightStyle.display !== "none" && (
        <div
          style={{
            ...spotlightStyle,
            background: "transparent",
            boxShadow: "0 0 0 4px rgba(212,116,42,0.5)",
            pointerEvents: "none",
            zIndex: 99998,
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      )}

      <div
        ref={tooltipRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...tooltipStyle,
          maxWidth: 300,
          width: isCenter ? 300 : undefined,
          position: "fixed",
          zIndex: 99999,
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {!isCenter && <div style={arrowStyle} />}

        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 12,
            padding: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            border: "0.5px solid var(--border)",
            position: "relative",
          }}
        >
          <button
            onClick={finish}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-tertiary)",
              padding: 4,
              lineHeight: 1,
              fontSize: 16,
            }}
          >
            x
          </button>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              margin: 0,
              color: "var(--text-primary)",
              lineHeight: 1.3,
            }}
          >
            {t(current.titleKey)}
          </h3>

          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              margin: "8px 0 16px",
              lineHeight: 1.5,
            }}
          >
            {t(current.descKey)}
          </p>

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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
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
                {t("tour.skip")}
              </button>
            ) : (
              <span />
            )}

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
              {t(current.buttonKey)}
            </button>
          </div>

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
    </>
  );
}
