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
    title: `${profile.nomEntreprise} | Répertoire`,
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
      <main className="max-w-[700px] mx-auto px-5 py-6 pb-20 md:pb-6">
        <ProProfileDetail profileId={id} />
      </main>
    </>
  );
}
