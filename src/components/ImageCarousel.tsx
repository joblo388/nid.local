"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

type ImageCarouselProps = {
  images: { url: string }[];
  onImageClick?: (index: number) => void;
};

export function ImageCarousel({ images, onImageClick }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = images.length;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index < 0 || index >= total) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 350);
    },
    [isTransitioning, total]
  );

  const goPrev = useCallback(() => goTo(current - 1), [goTo, current]);
  const goNext = useCallback(() => goTo(current + 1), [goTo, current]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - touchStartX.current;
    touchDeltaX.current = delta;
    // Resist at edges
    if ((current === 0 && delta > 0) || (current === total - 1 && delta < 0)) {
      setSwipeOffset(delta * 0.3);
    } else {
      setSwipeOffset(delta);
    }
  }, [current, total]);

  const handleTouchEnd = useCallback(() => {
    const threshold = 50;
    if (touchDeltaX.current < -threshold && current < total - 1) {
      goNext();
    } else if (touchDeltaX.current > threshold && current > 0) {
      goPrev();
    }
    setSwipeOffset(0);
  }, [current, total, goNext, goPrev]);

  if (total === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>
          <svg viewBox="0 0 36 36" width="48" height="48" fill="none" stroke="var(--text-tertiary)" strokeWidth="1">
            <rect x="2" y="8" width="32" height="22" rx="3" />
            <circle cx="11" cy="16" r="3" />
            <path d="M2 24l8-7 7 6 5-4 12 9" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image track */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          transform: `translateX(calc(-${current * 100}% + ${swipeOffset}px))`,
          transition: swipeOffset !== 0 ? "none" : "transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              minWidth: "100%",
              height: "100%",
              position: "relative",
              cursor: onImageClick ? "pointer" : "default",
            }}
            onClick={() => onImageClick?.(i)}
          >
            <Image
              src={img.url}
              alt={`Photo ${i + 1}`}
              fill
              sizes="(max-width: 900px) 100vw, 600px"
              style={{ objectFit: "cover" }}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Counter badge */}
      <div style={styles.counter}>
        {current + 1} / {total}
      </div>

      {/* Left arrow */}
      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          style={{ ...styles.arrow, left: 12 }}
          aria-label="Image précédente"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {current < total - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          style={{ ...styles.arrow, right: 12 }}
          aria-label="Image suivante"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div style={styles.dots}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              aria-label={`Aller à l'image ${i + 1}`}
              style={{
                ...styles.dot,
                background: i === current ? "var(--green)" : "var(--border-secondary)",
                transform: i === current ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "relative",
    width: "100%",
    height: 400,
    maxHeight: 500,
    borderRadius: 12,
    overflow: "hidden",
    border: "0.5px solid var(--border)",
    background: "var(--bg-secondary)",
    marginBottom: 20,
    userSelect: "none",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: 12,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 20,
    background: "rgba(0,0,0,0.5)",
    color: "white",
    zIndex: 2,
    pointerEvents: "none",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.85)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    color: "#1a1a18",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transition: "background 0.15s",
  },
  dots: {
    position: "absolute",
    bottom: 14,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 6,
    zIndex: 2,
    padding: "4px 8px",
    borderRadius: 12,
    background: "rgba(0,0,0,0.3)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "background 0.2s, transform 0.2s",
  },
};
