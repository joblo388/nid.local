"use client";

import dynamic from "next/dynamic";

const LeftSidebar = dynamic(
  () => import("@/components/LeftSidebar").then((m) => m.LeftSidebar),
  {
    ssr: false,
    loading: () => (
      <aside
        className="w-[248px] shrink-0 fixed left-0 top-0 h-screen hidden lg:block z-40"
        style={{
          background: "var(--bg-page)",
          borderRight: "0.5px solid var(--border)",
        }}
      />
    ),
  }
);

export function LeftSidebarWrapper() {
  return <LeftSidebar />;
}
