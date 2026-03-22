import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifications — nid.local" };

function tempsRelatif(dateStr: Date): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)} jours`;
}

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion?callbackUrl=/notifications");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { creeLe: "desc" },
    take: 50,
  });

  // Mark all as read
  await prisma.notification.updateMany({
    where: { userId: session.user.id, lu: false },
    data: { lu: true },
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[600px] mx-auto px-5 py-8">
        <h1 className="text-[20px] font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          Notifications
        </h1>

        {notifications.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
          >
            <p className="text-[14px]" style={{ color: "var(--text-tertiary)" }}>
              Aucune notification pour l&apos;instant.
            </p>
          </div>
        ) : (
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
          >
            {notifications.map((n, i) => (
              <Link
                key={n.id}
                href={`/post/${n.postId}`}
                className="flex flex-col gap-1 px-5 py-4 transition-colors hover-bg"
                style={{ borderBottom: i < notifications.length - 1 ? "0.5px solid var(--border)" : "none" }}
              >
                <p className="text-[13px]" style={{ color: "var(--text-primary)" }}>
                  <span className="font-semibold">{n.acteurNom}</span>
                  {n.type === "comment" ? " a commenté votre post" : " a interagi avec votre post"}
                </p>
                <p className="text-[12px] truncate" style={{ color: "var(--text-tertiary)" }}>
                  {n.postTitre}
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  {tempsRelatif(n.creeLe)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
