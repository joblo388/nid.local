import { Header } from "@/components/Header";
import { SkeletonPostDetail, SkeletonLine } from "@/components/Skeleton";

export default function PostLoading() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-5">
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-3">
            {/* Back link placeholder */}
            <SkeletonLine width={100} height={12} />

            {/* Post detail skeleton */}
            <SkeletonPostDetail />

            {/* Comment section skeleton */}
            <div
              className="rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
                padding: 24,
              }}
            >
              <SkeletonLine width={140} height={14} style={{ marginBottom: 16 }} />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="skeleton-pulse"
                      style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }}
                    />
                    <div className="flex-1 space-y-2">
                      <SkeletonLine width={120} height={10} />
                      <SkeletonLine width="90%" height={11} />
                      <SkeletonLine width="60%" height={11} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar placeholder — desktop only */}
          <div className="hidden md:block" style={{ width: 240, flexShrink: 0 }}>
            <div
              className="rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
                padding: 16,
              }}
            >
              <div className="space-y-3">
                <SkeletonLine width="100%" height={36} style={{ borderRadius: 8 }} />
                <SkeletonLine width="60%" height={10} />
                <SkeletonLine width="80%" height={10} />
                <SkeletonLine width="50%" height={10} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
