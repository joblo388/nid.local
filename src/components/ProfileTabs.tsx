"use client";

import { useState } from "react";

type Tab = { id: string; label: string; count: number };

export function ProfileTabs({ tabs, children }: { tabs: Tab[]; children: React.ReactNode[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex gap-0 overflow-x-auto mb-4 rounded-xl"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", scrollbarWidth: "none" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-colors shrink-0"
            style={
              active === tab.id
                ? { color: "var(--green-text)", borderBottom: "2px solid var(--green)", background: "var(--bg-card)" }
                : { color: "var(--text-tertiary)", borderBottom: "2px solid transparent" }
            }
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={
                  active === tab.id
                    ? { background: "var(--green-light-bg)", color: "var(--green-text)" }
                    : { background: "var(--bg-secondary)", color: "var(--text-tertiary)" }
                }
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tabs.map((tab, i) => (
        <div key={tab.id} style={{ display: active === tab.id ? "block" : "none" }}>
          {children[i]}
        </div>
      ))}
    </div>
  );
}
