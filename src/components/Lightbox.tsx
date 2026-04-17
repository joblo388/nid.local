"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale } from "@/lib/useLocale";

type LightboxProps = {
  images: string[];
  startIndex: number;
  onClose: () => void;
};

export function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const { t } = useLocale();
  const [index, setIndex] = useState(startIndex);
  const [visible, setVisible] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const lastTap = useRef(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const animateClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  // Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") animateClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateClose, images.length]);

  function navigate(dir: number) {
    if (zoomed) {
      setZoomed(false);
      setPanOffset({ x: 0, y: 0 });
    }
    setIndex((i) => (i + dir + images.length) % images.length);
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) animateClose();
  }

  // Double-click / double-tap to zoom
  function handleDoubleClick(e: React.MouseEvent | React.TouchEvent) {
    e.stopPropagation();
    if (zoomed) {
      setZoomed(false);
      setPanOffset({ x: 0, y: 0 });
    } else {
      setZoomed(true);
      setPanOffset({ x: 0, y: 0 });
    }
  }

  // Mouse drag for panning when zoomed
  function handleMouseDown(e: React.MouseEvent) {
    if (!zoomed) return;
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...panOffset };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging || !zoomed) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPanOffset({ x: panStart.current.x + dx, y: panStart.current.y + dy });
  }

  function handleMouseUp() {
    setDragging(false);
  }

  // Scroll wheel zoom
  function handleWheel(e: React.WheelEvent) {
    e.stopPropagation();
    if (e.deltaY < 0 && !zoomed) {
      setZoomed(true);
      setPanOffset({ x: 0, y: 0 });
    } else if (e.deltaY > 0 && zoomed) {
      setZoomed(false);
      setPanOffset({ x: 0, y: 0 });
    }
  }

  // Touch events: swipe navigation + double-tap zoom + pinch
  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      if (zoomed) {
        setDragging(true);
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStart.current = { ...panOffset };
      }
      // Double-tap detection
      const now = Date.now();
      if (now - lastTap.current < 300) {
        handleDoubleClick(e);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (dragging && zoomed && e.touches.length === 1) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setPanOffset({ x: panStart.current.x + dx, y: panStart.current.y + dy });
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    setDragging(false);
    if (zoomed) return;
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - (touchStartY.current ?? 0);
    // Only swipe if horizontal movement > vertical
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      diffX > 0 ? navigate(-1) : navigate(1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  const hasMultiple = images.length > 1;

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: `rgba(0, 0, 0, ${visible ? 0.95 : 0})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease",
        touchAction: "none",
      }}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); animateClose(); }}
        aria-label={t("common.fermer")}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10001,
          backdropFilter: "blur(8px)",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Left arrow */}
      {hasMultiple && (
        <button
          onClick={(e) => { e.stopPropagation(); navigate(-1); }}
          aria-label={t("common.precedent")}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
            backdropFilter: "blur(8px)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div
        style={{
          position: "relative",
          width: "90vw",
          height: "85vh",
          maxWidth: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: visible ? "scale(1)" : "scale(0.9)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.2s ease, opacity 0.2s ease",
          userSelect: "none",
        }}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt=""
          draggable={false}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transform: zoomed
              ? `scale(2) translate(${panOffset.x / 2}px, ${panOffset.y / 2}px)`
              : "scale(1)",
            transition: dragging ? "none" : "transform 0.2s ease",
            cursor: zoomed ? (dragging ? "grabbing" : "grab") : "zoom-in",
            pointerEvents: "auto",
          }}
        />
      </div>

      {/* Right arrow */}
      {hasMultiple && (
        <button
          onClick={(e) => { e.stopPropagation(); navigate(1); }}
          aria-label={t("common.suivant")}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
            backdropFilter: "blur(8px)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Counter */}
      {hasMultiple && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: 13,
            fontWeight: 500,
            background: "rgba(0,0,0,0.5)",
            padding: "4px 14px",
            borderRadius: 20,
            backdropFilter: "blur(8px)",
            zIndex: 10001,
          }}
        >
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
