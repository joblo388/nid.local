"use client";

import { type ReactNode } from "react";
import { useLightbox } from "./LightboxProvider";

/**
 * Wraps children (typically an image) with an onClick that opens the lightbox.
 * Works in both server and client components — just wrap the image markup.
 */
export function LightboxImage({
  images,
  index = 0,
  children,
}: {
  images: string[];
  index?: number;
  children: ReactNode;
}) {
  const { openLightbox } = useLightbox();

  return (
    <div
      onClick={() => openLightbox(images, index)}
      style={{ cursor: "zoom-in" }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(images, index);
        }
      }}
    >
      {children}
    </div>
  );
}
