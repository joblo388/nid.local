import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ParametresForm } from "./ParametresForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Paramètres — nid.local" };

export default async function ParametresPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion?callbackUrl=/parametres");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, username: true, name: true, email: true, image: true,
      emailNotifComments: true, emailNotifReplies: true, emailNotifMentions: true,
      emailNotifMessages: true, emailNotifAnnonces: true,
    },
  });
  if (!user) redirect("/");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[600px] mx-auto px-5 py-8">
        <h1 className="text-[20px] font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          Paramètres du compte
        </h1>
        <ParametresForm user={user} />
      </main>
    </div>
  );
}
