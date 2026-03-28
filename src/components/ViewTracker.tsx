"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function ViewTracker({ postId }: { postId: string }) {
  const { data: session } = useSession();

  useEffect(() => {
    fetch(`/api/posts/${postId}/view`, { method: "POST" }).catch(() => {});
  }, [postId]);

  // Record in browsing history for logged-in users
  useEffect(() => {
    if (session?.user) {
      fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "post", targetId: postId }),
      }).catch(() => {});
    }
  }, [postId, session?.user]);

  return null;
}
