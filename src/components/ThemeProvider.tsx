"use client";

import { useEffect, type ReactNode } from "react";

function getThemeCookie(): string {
  if (typeof document === "undefined") return "auto";
  const match = document.cookie.match(/(?:^|; )theme=(\w+)/);
  return match?.[1] ?? "auto";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const mode = getThemeCookie();
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    if (mode === "dark") root.classList.add("dark");
    else if (mode === "light") root.classList.add("light");
  }, []);

  return <>{children}</>;
}
