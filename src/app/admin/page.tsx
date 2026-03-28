import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { AdminActions } from "./AdminActions";
import { PinButton } from "./AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    : null;

  if (user?.role !== "admin") notFound();

  const [reports, recentPosts, stats] = await Promise.all([
    prisma.report.findMany({
      orderBy: { creeLe: "desc" },
      include: { auteur: { select: { username: true, name: true } } },
    }),
    prisma.post.findMany({
      orderBy: [{ epingle: "desc" }, { creeLe: "desc" }],
      take: 20,
      select: { id: true, titre: true, auteurNom: true, epingle: true, creeLe: true },
    }),
    Promise.all([
      prisma.post.count(),
      prisma.comment.count(),
      prisma.user.count(),
      prisma.report.count(),
    ]).then(([posts, comments, users, rpts]) => ({ posts, comments, users, reports: rpts })),
  ]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-6 space-y-6">
        <h1 className="text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
          Administration
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Posts", value: stats.posts },
            { label: "Commentaires", value: stats.comments },
            { label: "Utilisateurs", value: stats.users },
            { label: "Signalements", value: stats.reports },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center"
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
            >
              <p className="text-[24px] font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
              <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Posts épinglés */}
        <div>
          <h2 className="text-[14px] font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Posts récents — gestion épingle
          </h2>
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
          >
            {recentPosts.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < recentPosts.length - 1 ? "0.5px solid var(--border)" : "none" }}
              >
                {p.epingle && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: "var(--amber-bg)", color: "var(--amber-text)" }}>
                    épinglé
                  </span>
                )}
                <Link
                  href={`/post/${p.id}`}
                  className="flex-1 text-[13px] truncate transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.titre}
                </Link>
                <span className="text-[11px] shrink-0" style={{ color: "var(--text-tertiary)" }}>
                  {p.auteurNom}
                </span>
                <PinButton postId={p.id} initialEpingle={p.epingle} />
              </div>
            ))}
          </div>
        </div>

        {/* Signalements */}
        <div>
          <h2 className="text-[14px] font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Signalements récents
          </h2>
          {reports.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
            >
              <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>Aucun signalement.</p>
            </div>
          ) : (
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
            >
              {reports.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 px-4 py-3"
                  style={{ borderBottom: i < reports.length - 1 ? "0.5px solid var(--border)" : "none" }}
                >
                  <span
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold shrink-0"
                    style={{
                      background: r.type === "post" ? "var(--blue-bg)" : "var(--amber-bg)",
                      color: r.type === "post" ? "var(--blue-text)" : "var(--amber-text)",
                    }}
                  >
                    {r.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] truncate" style={{ color: "var(--text-primary)" }}>
                      {r.reason}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      par {r.auteur?.username ?? r.auteur?.name ?? "anonyme"} · {new Date(r.creeLe).toLocaleDateString("fr-CA")}
                    </p>
                  </div>
                  <Link
                    href={r.type === "post" ? `/post/${r.targetId}` : `/post/unknown#${r.targetId}`}
                    className="text-[12px] font-medium transition-opacity hover:opacity-70 shrink-0"
                    style={{ color: "var(--green)" }}
                  >
                    Voir
                  </Link>
                  <AdminActions reportId={r.id} type={r.type as "post" | "comment"} targetId={r.targetId} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
