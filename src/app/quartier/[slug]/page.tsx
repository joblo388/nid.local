import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { quartiers, posts } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return quartiers.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const quartier = quartiers.find((q) => q.slug === slug);
  if (!quartier) return {};
  return {
    title: `${quartier.nom} — nid.local`,
    description: `Discussions immobilières dans le quartier ${quartier.nom} à ${quartier.ville}.`,
  };
}

export default async function QuartierPage({ params }: Props) {
  const { slug } = await params;
  const quartier = quartiers.find((q) => q.slug === slug);
  if (!quartier) notFound();

  const postsQuartier = posts
    .filter((p) => p.quartier.slug === slug)
    .sort((a, b) => new Date(b.creeLe).getTime() - new Date(a.creeLe).getTime());

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-5">
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${quartier.couleur}`} />
              <div>
                <h1 className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>{quartier.nom}</h1>
                <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>{quartier.ville}</p>
              </div>
            </div>

            {postsQuartier.length === 0 ? (
              <div
                className="rounded-xl p-10 text-center"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                  Aucune publication dans ce quartier pour l&apos;instant.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {postsQuartier.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
