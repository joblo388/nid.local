import Link from "next/link";
import { Header } from "@/components/Header";
import { CapaciteEmprunt } from "./CapaciteEmprunt";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capacité d'emprunt Québec 2026 — Combien puis-je emprunter?",
  description: "Estimez gratuitement le prix maximum que vous pouvez vous permettre selon les ratios GDS/TDS des banques canadiennes. Stress test, revenus locatifs et co-emprunteur inclus.",
  keywords: ["capacité emprunt québec", "combien emprunter hypothèque", "calcul capacité hypothécaire", "stress test hypothèque canada", "ratio GDS TDS", "pré-approbation hypothécaire"],
};

const ressources = ressourcesUtiles;

export default async function CapaciteEmpruntPage() {
  const dbPosts = await prisma.post.findMany({ orderBy: [{ epingle: "desc" }, { nbVotes: "desc" }], take: 5 });
  const popularPosts = dbPosts.map(dbPostToAppPost);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
        <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>nid.local</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Capacité d&apos;emprunt</span>
        </nav>

        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-5">
            <div>
              <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>Capacité d&apos;emprunt</h1>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Estimez le prix maximum que vous pouvez vous permettre selon les ratios GDS/TDS utilisés par les banques canadiennes. Stress test, revenus locatifs et co-emprunteur inclus.
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
              <CapaciteEmprunt />
            </div>

            {/* CTA */}
            <div className="rounded-xl p-6 text-center space-y-3" style={{ background: "var(--green-light-bg)", border: "0.5px solid var(--border)" }}>
              <h2 className="text-[15px] font-bold" style={{ color: "var(--green-text)" }}>Prêt à chercher?</h2>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--green-text)", opacity: 0.85 }}>Parcourez les annonces ou calculez votre paiement hypothécaire exact.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/annonces" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--green)" }}>Voir les annonces →</Link>
                <Link href="/calculatrice-hypothecaire" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80" style={{ background: "var(--bg-card)", color: "var(--green-text)", border: "0.5px solid var(--border)" }}>Calculatrice hypothécaire</Link>
              </div>
            </div>
          </div>

          <aside className="hidden md:flex flex-col gap-3 w-[240px] shrink-0">
            <Link href="/annonces" className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center" style={{ background: "var(--green)" }}>Voir les annonces</Link>
            {popularPosts.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}><h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Discussions populaires</h3></div>
                <ul>{popularPosts.map((post, i) => (<li key={post.id} style={{ borderBottom: i < popularPosts.length - 1 ? "0.5px solid var(--border)" : "none" }}><Link href={`/post/${post.id}`} className="flex flex-col gap-1 px-4 py-3 transition-colors hover-bg"><span className="text-[12px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>{post.titre}</span><span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{post.quartier.nom} · {post.nbVotes} votes</span></Link></li>))}</ul>
              </div>
            )}
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}><h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Ressources utiles</h3></div>
              <ul>{ressources.map((r, i) => (<li key={r.label} style={{ borderBottom: i < ressources.length - 1 ? "0.5px solid var(--border)" : "none" }}><Link href={r.href} className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg"><span className="text-[13px]" style={{ color: "var(--text-primary)" }}>{r.label}</span><svg className="w-3 h-3 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link></li>))}</ul>
            </div>
            <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>© 2026 nid.local — Fait au Québec</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
