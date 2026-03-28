"use client";

import { useState, useEffect } from "react";

type LinkMeta = {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
  url: string;
};

export function LinkPreview({ url }: { url: string }) {
  const [meta, setMeta] = useState<LinkMeta | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchMeta() {
      try {
        const res = await fetch(
          `/api/link-preview?url=${encodeURIComponent(url)}`
        );
        if (!res.ok) throw new Error("fetch failed");
        const data: LinkMeta = await res.json();
        if (!cancelled) {
          // If no title at all, treat as error (useless preview)
          if (!data.title) {
            setError(true);
          } else {
            setMeta(data);
          }
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMeta();
    return () => { cancelled = true; };
  }, [url]);

  // Loading skeleton
  if (loading) {
    return (
      <div
        className="rounded-lg overflow-hidden my-2 animate-pulse"
        style={{
          border: "0.5px solid var(--border)",
          background: "var(--bg-secondary)",
          height: "80px",
        }}
      />
    );
  }

  // Error fallback: styled link
  if (error || !meta) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 my-1 text-[12px] underline transition-opacity hover:opacity-70"
        style={{ color: "var(--green)" }}
      >
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        {url.length > 60 ? url.slice(0, 60) + "…" : url}
      </a>
    );
  }

  return (
    <a
      href={meta.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg overflow-hidden my-2 no-underline transition-opacity hover:opacity-85"
      style={{
        border: "0.5px solid var(--border)",
        background: "var(--bg-secondary)",
        maxWidth: "100%",
      }}
    >
      <div className="flex" style={{ minHeight: "72px" }}>
        {/* Image thumbnail */}
        {meta.image && (
          <div
            className="shrink-0"
            style={{ width: "80px", height: "80px", overflow: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meta.image}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide broken images
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Text content */}
        <div className="flex-1 min-w-0 px-3 py-2 flex flex-col justify-center gap-0.5">
          {/* Site name + favicon */}
          <div className="flex items-center gap-1.5">
            {meta.favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={meta.favicon}
                alt=""
                className="w-3 h-3 shrink-0 rounded-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            {meta.siteName && (
              <span
                className="text-[11px] truncate"
                style={{ color: "var(--text-tertiary)" }}
              >
                {meta.siteName}
              </span>
            )}
          </div>

          {/* Title */}
          {meta.title && (
            <span
              className="text-[13px] font-medium truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {meta.title}
            </span>
          )}

          {/* Description */}
          {meta.description && (
            <span
              className="text-[12px] overflow-hidden"
              style={{
                color: "var(--text-tertiary)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {meta.description}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
