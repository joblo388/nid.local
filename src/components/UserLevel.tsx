type UserLevelProps = {
  levelName: string;
  levelColor: string;
  points?: number;
  progress?: number;
  nextLevelName?: string | null;
  /** Compact mode: just show the level pill, no points or bar */
  compact?: boolean;
};

export function UserLevel({
  levelName,
  levelColor,
  points,
  progress,
  nextLevelName,
  compact = false,
}: UserLevelProps) {
  if (compact) {
    return (
      <span
        className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold leading-none"
        style={{ background: levelColor, color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}
      >
        {levelName}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold leading-none"
          style={{ background: levelColor, color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}
        >
          {levelName}
        </span>
        {points !== undefined && (
          <span className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>
            {points} pts
          </span>
        )}
      </div>
      {progress !== undefined && nextLevelName && (
        <div className="flex items-center gap-2">
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--bg-secondary)", maxWidth: "120px" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--green)" }}
            />
          </div>
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            {nextLevelName}
          </span>
        </div>
      )}
    </div>
  );
}
