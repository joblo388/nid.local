import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, quartierBySlug } from "@/lib/data";
import { PostCard } from "@/components/PostCard";

const TYPE_LABELS: Record<string, string> = {
  unifamiliale: "Unifamiliale", condo: "Condo", duplex: "Duplex", triplex: "Triplex", quadruplex: "Quadruplex",
};

export async function SearchResults({ q }: { q: string }) {
  if (!q || q.trim().length < 2) {
    return (
      <div className="rounded-xl p-8 text-center"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
        <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          Entrez au moins 2 caractères pour rechercher.
        </p>
      </div>
    );
  }

  const [dbPosts, dbListings] = await Promise.all([
    prisma.post.findMany({
      where: {
        OR: [
          { titre: { contains: q, mode: "insensitive" } },
          { contenu: { contains: q, mode: "insensitive" } },
          { auteurNom: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: [{ epingle: "desc" }, { nbVotes: "desc" }],
      take: 30,
      include: { auteur: { select: { tag: true } } },
    }),
    prisma.listing.findMany({
      where: {
        statut: "active",
        OR: [
          { titre: { contains: q, mode: "insensitive" } },
          { adresse: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { creeLe: "desc" },
      take: 10,
      include: { images: { where: { principale: true }, take: 1 } },
    }),
  ]);

  const posts = dbPosts.map(dbPostToAppPost);

  if (posts.length === 0 && dbListings.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Aucun résultat pour <strong>&ldquo;{q}&rdquo;</strong>.
        </p>
        <p className="text-[12px] mt-2" style={{ color: "var(--text-tertiary)" }}>
          Essayez des mots différents ou vérifiez l&apos;orthographe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Annonces */}
      {dbListings.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Annonces — {dbListings.length} résultat{dbListings.length > 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {dbListings.map((listing) => {
              const qr = quartierBySlug[listing.quartierSlug];
              const imgUrl = listing.images[0]?.url;
              return (
                <Link
                  key={listing.id}
                  href={`/annonces/${listing.id}`}
                  className="flex gap-3 px-4 py-3 rounded-xl transition-colors hover-bg"
                  style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: "var(--bg-secondary)", position: "relative" }}
                  >
                    {imgUrl ? (
                      <Image src={imgUrl} alt="" fill sizes="64px" style={{ objectFit: "cover" }} />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="var(--text-tertiary)" strokeWidth="1">
                        <rect x="2" y="10" width="28" height="20" rx="2" /><path d="M2 14l14-10 14 10" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[14px] font-medium" style={{ color: "var(--text-primary)" }}>
                        {listing.prix.toLocaleString("fr-CA")} $
                      </span>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                        style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
                      >
                        {TYPE_LABELS[listing.type] ?? listing.type}
                      </span>
                    </div>
                    <p className="text-[13px] truncate" style={{ color: "var(--text-secondary)" }}>{listing.titre}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      {listing.adresse} · {qr?.nom ?? listing.quartierSlug}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Discussions — {posts.length} résultat{posts.length > 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} searchQuery={q} hasVoted={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
