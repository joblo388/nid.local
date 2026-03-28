"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";

type Props = {
  onRefresh: () => Promise<void>;
  children: ReactNode;
};

const THRESHOLD = 60;
const MAX_PULL = 120;
const INDICATOR_HEIGHT = 48;

export function PullToRefresh({ onRefresh, children }: Props) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const startY = useRef(0);
  const currentY = useRef(0);
  const pulling = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Detect touch capability on mount
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (refreshing) return;
      // Only activate when at the very top of the page
      if (window.scrollY > 0) return;
      startY.current = e.touches[0].clientY;
      currentY.current = startY.current;
      pulling.current = true;
    },
    [refreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!pulling.current || refreshing) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      // If user is swiping up or horizontally, bail out
      if (deltaY <= 0) {
        setPullDistance(0);
        return;
      }

      // Don't interfere if we've scrolled down since touchstart
      if (window.scrollY > 0) {
        pulling.current = false;
        setPullDistance(0);
        return;
      }

      // Apply resistance — diminishing returns as user pulls further
      const resistance = Math.min(deltaY * 0.5, MAX_PULL);
      setPullDistance(resistance);
    },
    [refreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current || refreshing) return;
    pulling.current = false;

    if (pullDistance >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(INDICATOR_HEIGHT);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, refreshing, onRefresh]);

  // Progress from 0 to 1 based on pull distance relative to threshold
  const progress = Math.min(pullDistance / THRESHOLD, 1);
  // Rotation of the arrow icon (0 to 180 degrees)
  const rotation = progress * 180;

  if (!isTouchDevice) {
    return <>{children}</>;
  }

  return (
    <div
      ref={wrapperRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ overscrollBehaviorY: "contain" }}
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          height: pullDistance > 0 ? `${Math.min(pullDistance, INDICATOR_HEIGHT)}px` : "0px",
          transition: pulling.current ? "none" : "height 300ms cubic-bezier(0.2, 0, 0, 1)",
          background: "var(--bg-page)",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: progress,
            transition: pulling.current ? "none" : "opacity 300ms ease",
          }}
        >
          {refreshing ? (
            /* Spinning loader */
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              style={{ color: "var(--green)", animation: "ptr-spin 800ms linear infinite" }}
            >
              <circle
                cx="11"
                cy="11"
                r="9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="42 14"
              />
            </svg>
          ) : (
            /* Circular arrow that rotates with pull */
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                color: "var(--green)",
                transform: `rotate(${rotation}deg)`,
                transition: pulling.current ? "none" : "transform 300ms ease",
              }}
            >
              <path
                d="M12 4V1L8 5l4 4V6a6 6 0 11-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
