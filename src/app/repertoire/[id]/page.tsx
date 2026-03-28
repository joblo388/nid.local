import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { ProProfileDetail } from "./ProProfileDetail";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const profile = await prisma.proProfile.findUnique({ where: { id } });
  if (!profile) return {};
  const excerpt = profile.description.slice(0, 155).replace(/\s\S*$/, "") + "...";
  return {
    title: `${profile.nomEntreprise} — Repertoire — nid.local`,
    description: excerpt,
    openGraph: {
      title: profile.nomEntreprise,
      description: excerpt,
      type: "profile",
      siteName: "nid.local",
    },
  };
}

export default async function ProProfilePage({ params }: Props) {
  const { id } = await params;

  const profile = await prisma.proProfile.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!profile) notFound();

  return (
    <>
      <Header />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "20px 20px 100px" }}>
        <ProProfileDetail profileId={id} />
      </main>
    </>
  );
}
