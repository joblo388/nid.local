import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { quartierBySlug } from "@/lib/data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mes favoris",
};

const TYPE_LABELS: Record<string, string> = {
  unifamiliale: "Unifamiliale", condo: "Condo", duplex: "Duplex", triplex: "Triplex", quadruplex: "Quadruplex",
};

export default async function FavorisPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion?callbackUrl=/favoris");

  const favorites = await prisma.listingFavorite.findMany({
    where: { userId: session.user.id },
    orderBy: { creeLe: "desc" },
    include: {
      listing: {
        include: { images: { where: { principale: true }, take: 1 } },
      },
    },
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[900px] mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>Mes favoris</h1>
            <p className="text-[13px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              {favorites.length} annonce{favorites.length !== 1 ? "s" : ""} sauvegardée{favorites.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/annonces"
            className="text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--green)" }}
          >
            Voir toutes les annonces →
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div
            className="rounded-xl px-6 py-16 text-center"
            style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
          >
            <p className="text-[14px] mb-2" style={{ color: "var(--text-secondary)" }}>
              Aucun favori pour l&apos;instant
            </p>
            <p className="text-[13px] mb-5" style={{ color: "var(--text-tertiary)" }}>
              Clique sur le coeur d&apos;une annonce pour la sauvegarder ici.
            </p>
            <Link
              href="/annonces"
              className="inline-block text-[13px] font-semibold text-white px-4 py-2 rounded-lg"
              style={{ background: "var(--green)" }}
            >
              Parcourir les annonces
            </Link>
          </div>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {favorites.map(({ listing }) => {
              const q = quartierBySlug[listing.quartierSlug];
              const imgUrl = listing.images[0]?.url;
              return (
                <Link
                  key={listing.id}
                  href={`/annonces/${listing.id}`}
                  className="rounded-xl overflow-hidden transition-colors"
                  style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ height: 140, background: "var(--bg-secondary)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {imgUrl ? (
                      <Image src={imgUrl} alt={listing.titre} fill sizes="300px" style={{ objectFit: "cover" }} loading="lazy" />
                    ) : (
                      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="var(--text-tertiary)" strokeWidth="1">
                        <rect x="2" y="10" width="28" height="20" rx="2" /><path d="M2 14l14-10 14 10" />
                      </svg>
                    )}
                    {listing.statut !== "active" && (
                      <div style={{ position: "absolute", top: 8, left: 8, fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500, background: listing.statut === "vendu" ? "var(--red-bg)" : "var(--bg-secondary)", color: listing.statut === "vendu" ? "var(--red-text)" : "var(--text-tertiary)" }}>
                        {listing.statut === "vendu" ? "Vendu" : "Retiré"}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 18, fontWeight: 500 }}>{listing.prix.toLocaleString("fr-CA")} $</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
                      {TYPE_LABELS[listing.type] ?? listing.type} · {q?.nom ?? listing.quartierSlug}
                    </div>
                    <div style={{ fontSize: 13, marginTop: 4, fontWeight: 500 }}>{listing.titre}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>{listing.adresse}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 6, display: "flex", gap: 10 }}>
                      <span>{listing.chambres} ch.</span>
                      <span>{listing.sallesDeBain} sdb</span>
                      <span>{listing.superficie.toLocaleString("fr-CA")} pi²</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
