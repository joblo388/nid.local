"use client";

import { useState, useEffect, useCallback } from "react";

type PollOption = {
  id: string;
  label: string;
  votes: number;
};

type PollData = {
  id: string;
  postId: string;
  options: PollOption[];
  totalVotes: number;
  userVoteOptionId: string | null;
};

export function PollDisplay({ pollId }: { pollId: string }) {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch(`/api/polls/${pollId}`);
      if (!res.ok) return;
      const data = await res.json();
      setPoll(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  async function handleVote(optionId: string) {
    if (voting || !poll || poll.userVoteOptionId) return;
    setVoting(true);
    setError("");

    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setPoll(data);
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setVoting(false);
    }
  }

  if (loading) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div
          className="h-4 w-32 rounded-lg animate-pulse"
          style={{ background: "var(--bg-secondary)" }}
        />
        <div className="mt-3 space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 rounded-lg animate-pulse"
              style={{ background: "var(--bg-secondary)" }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!poll) return null;

  const hasVoted = !!poll.userVoteOptionId;
  const maxVotes = Math.max(...poll.options.map((o) => o.votes), 1);

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          style={{ color: "var(--green)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Sondage
        </span>
      </div>

      <div className="space-y-2">
        {poll.options.map((option) => {
          const pct = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
          const isSelected = poll.userVoteOptionId === option.id;

          if (hasVoted) {
            return (
              <div
                key={option.id}
                className="relative rounded-lg overflow-hidden"
                style={{
                  border: isSelected
                    ? "1.5px solid var(--green)"
                    : "0.5px solid var(--border)",
                  minHeight: "40px",
                }}
              >
                {/* Background fill bar */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "var(--green-light-bg)",
                    width: `${pct}%`,
                    transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
                {/* Content */}
                <div className="relative flex items-center justify-between px-3 py-2.5 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    {isSelected && (
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: "var(--green)" }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span
                      className="text-[13px] font-medium break-words"
                      style={{ color: isSelected ? "var(--green-text)" : "var(--text-primary)", overflowWrap: "break-word", wordBreak: "break-word" }}
                    >
                      {option.label}
                    </span>
                  </div>
                  <span
                    className="text-[12px] font-semibold flex-shrink-0 ml-2"
                    style={{ color: "var(--green-text)" }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          }

          // Not voted yet — clickable option
          return (
            <button
              key={option.id}
              type="button"
              disabled={voting}
              onClick={() => handleVote(option.id)}
              className="w-full text-left rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all disabled:opacity-50"
              style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border)",
                color: "var(--text-primary)",
                cursor: voting ? "wait" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!voting) {
                  e.currentTarget.style.borderColor = "var(--green)";
                  e.currentTarget.style.background = "var(--green-light-bg)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--bg-secondary)";
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error && (
        <p
          className="mt-2 text-[12px] px-3 py-2 rounded-lg"
          style={{ background: "var(--red-bg)", color: "var(--red-text)" }}
        >
          {error}
        </p>
      )}

      <p className="mt-3 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
        {poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}
        {hasVoted && " · Vous avez voté"}
      </p>
    </div>
  );
}
