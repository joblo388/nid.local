"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/lib/useLocale";

type Props = {
  quartierSlug: string;
  initialSubscribed: boolean;
};

export function SubscribeButton({ quartierSlug, initialSubscribed }: Props) {
  const { t } = useLocale();
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    // Optimistic update
    const prev = subscribed;
    setSubscribed(!prev);

    startTransition(async () => {
      try {
        const res = await fetch("/api/quartiers/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quartierSlug }),
        });
        if (!res.ok) {
          // Revert on error
          setSubscribed(prev);
          return;
        }
        const data = await res.json();
        setSubscribed(data.subscribed);
      } catch {
        setSubscribed(prev);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="px-3 py-1 rounded-lg text-[12px] font-medium transition-colors whitespace-nowrap min-h-[44px] flex items-center justify-center"
      style={
        subscribed
          ? {
              background: "var(--green-light-bg)",
              color: "var(--green-text)",
              border: "0.5px solid var(--green)",
            }
          : {
              background: "var(--bg-secondary)",
              color: "var(--text-secondary)",
              border: "0.5px solid var(--border)",
            }
      }
    >
      {subscribed ? `${t("subscribe.suivi")} \u2713` : t("subscribe.suivre")}
    </button>
  );
}
