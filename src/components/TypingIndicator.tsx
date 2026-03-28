"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  conversationId: string;
};

export function TypingIndicator({ conversationId }: Props) {
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let active = true;

    async function poll() {
      if (!active) return;
      try {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        const res = await fetch(`/api/conversations/${conversationId}/typing`, {
          signal: abortRef.current.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        if (active) {
          setTypingUser(data.typing?.username ?? null);
        }
      } catch {
        // Ignore abort errors and network failures
      }
    }

    poll();
    const interval = setInterval(poll, 2000);

    return () => {
      active = false;
      abortRef.current?.abort();
      clearInterval(interval);
    };
  }, [conversationId]);

  if (!typingUser) return null;

  return (
    <div className="flex items-center gap-2 px-1 py-1">
      <div className="typing-dots" aria-hidden="true">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span
        className="text-[12px]"
        style={{ color: "var(--text-tertiary)" }}
      >
        {typingUser} est en train d&apos;écrire...
      </span>
    </div>
  );
}
