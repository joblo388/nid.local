import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { NouveauPostForm } from "./NouveauPostForm";

export const metadata = {
  title: "Nouvelle discussion",
};

export default async function NouveauPostPage() {
  const session = await auth();
  if (!session) redirect("/auth/connexion?callbackUrl=/nouveau-post");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[680px] mx-auto px-5 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] mb-6" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/" className="hover:opacity-70 transition-opacity">Fil</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)" }}>Nouvelle discussion</span>
        </div>

        <div
          className="rounded-xl p-6"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <h1 className="text-[22px] font-bold mb-6" style={{ color: "var(--text-primary)" }}>
            Nouvelle discussion
          </h1>
          <NouveauPostForm />
        </div>

        <p className="text-[11px] text-center mt-4" style={{ color: "var(--text-tertiary)" }}>
          Restez respectueux et constructif. Les alertes et informations doivent être vérifiées.
        </p>
      </main>
    </div>
  );
}
