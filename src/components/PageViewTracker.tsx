"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    fetch("/api/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || undefined,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
