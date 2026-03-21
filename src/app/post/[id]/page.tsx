import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { posts } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return posts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  if (!post) return {};
  return { title: `${post.titre} — nid.local` };
}

const badgeStyles: Record<string, { bg: string; color: string }> = {
  alerte:    { bg: "#FCEBEB", color: "#A32D2D" },
  question:  { bg: "#E6F1FB", color: "#185FA5" },
  vente:     { bg: "#E1F5EE", color: "#0F6E56" },
  location:  { bg: "#EEE9FB", color: "#5B31B3" },
  renovation:{ bg: "#FAEEDA", color: "#854F0B" },
  voisinage: { bg: "#F1F0F5", color: "#4A4660" },
};

const badgeLabels: Record<string, string> = {
  alerte: "Alerte", question: "Question", vente: "Vente",
  location: "Location", renovation: "Conseil", voisinage: "Voisinage",
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();

  const dateStr = new Date(post.creeLe).toLocaleDateString("fr-CA", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const badge = badgeStyles[post.categorie] ?? { bg: "#f1f1f1", color: "#555" };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-5">
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[12px] transition-opacity hover:opacity-60"
              style={{ color: "var(--text-tertiary)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour au fil
            </Link>

            <article
              className="rounded-xl p-6"
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                  style={{ background: badge.bg, color: badge.color }}
                >
                  {badgeLabels[post.categorie] ?? post.categorie}
                </span>
                <Link
                  href={`/quartier/${post.quartier.slug}`}
                  className="text-[12px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--green)" }}
                >
                  {post.quartier.nom}
                </Link>
              </div>

              <h1 className="text-[18px] font-bold mb-4 leading-snug" style={{ color: "var(--text-primary)" }}>
                {post.titre}
              </h1>

              <p className="text-[14px] leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>{post.contenu}</p>

              <div
                className="flex items-center justify-between pt-4"
                style={{ borderTop: "0.5px solid var(--border)" }}
              >
                <div className="flex items-center gap-3 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                  <span>par <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{post.auteur}</span></span>
                  <span>·</span>
                  <span>{dateStr}</span>
                </div>
                <button
                  className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {post.nbVotes}
                </button>
              </div>
            </article>

            <div
              className="rounded-xl p-6"
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
            >
              <h2 className="text-[14px] font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                {post.nbCommentaires} réponses
              </h2>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full shrink-0 mt-0.5" style={{ background: "var(--bg-secondary)" }} />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 rounded-full w-1/4" style={{ background: "var(--bg-secondary)" }} />
                      <div className="h-2.5 rounded-full w-3/4" style={{ background: "var(--bg-secondary)" }} />
                      <div className="h-2.5 rounded-full w-1/2" style={{ background: "var(--bg-secondary)" }} />
                    </div>
                  </div>
                ))}
                <p className="text-[12px] text-center pt-2" style={{ color: "var(--text-tertiary)" }}>
                  Connectez-vous pour voir les commentaires et participer à la discussion.
                </p>
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
