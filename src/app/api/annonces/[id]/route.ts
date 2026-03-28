import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      documents: true,
      auteur: { select: { id: true, username: true, name: true, image: true, createdAt: true } },
      commentaires: {
        orderBy: { creeLe: "desc" },
        include: { auteur: { select: { id: true, username: true, name: true, image: true } } },
      },
      prixHistorique: { orderBy: { creeLe: "asc" } },
      _count: { select: { favoris: true, commentaires: true } },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }

  // Increment views
  await prisma.listing.update({ where: { id }, data: { nbVues: { increment: 1 } } });

  const session = await auth();
  const userId = session?.user?.id;
  const isOwner = userId === listing.auteurId;

  const isFavorited = userId
    ? !!(await prisma.listingFavorite.findUnique({
        where: { userId_listingId: { userId, listingId: id } },
      }))
    : false;

  // Auteur info — respecter le mode anonyme
  const auteurInfo = listing.anonyme && !isOwner
    ? { id: listing.auteur.id, username: "Propriétaire", image: null, memberSince: listing.auteur.createdAt.toISOString(), anonyme: true }
    : { id: listing.auteur.id, username: listing.auteur.username ?? listing.auteur.name ?? "anonyme", image: listing.auteur.image, memberSince: listing.auteur.createdAt.toISOString(), anonyme: false };

  return NextResponse.json({
    id: listing.id,
    titre: listing.titre,
    description: listing.description,
    prix: listing.prix,
    type: listing.type,
    style: listing.style,
    quartierSlug: listing.quartierSlug,
    villeSlug: listing.villeSlug,
    adresse: listing.adresse,
    chambres: listing.chambres,
    sallesDeBain: listing.sallesDeBain,
    superficie: listing.superficie,
    superficieTerrain: listing.superficieTerrain,
    anneeConstruction: listing.anneeConstruction,
    stationnement: listing.stationnement,
    chauffage: listing.chauffage,
    eauChaude: listing.eauChaude,
    taxesMunicipales: listing.taxesMunicipales,
    taxesScolaires: listing.taxesScolaires,
    fraisCondo: listing.fraisCondo,
    lienVisite: listing.lienVisite,
    mls: listing.mls,
    anonyme: listing.anonyme,
    telephone: listing.telephone,
    statut: listing.statut,
    nbVues: listing.nbVues + 1,
    nbClics: listing.nbClics,
    nbFavoris: listing._count.favoris,
    nbCommentaires: listing._count.commentaires,
    isFavorited,
    isOwner,
    creeLe: listing.creeLe.toISOString(),
    images: listing.images,
    documents: listing.documents,
    commentaires: listing.commentaires.map((c) => ({
      id: c.id,
      contenu: c.contenu,
      auteurNom: c.auteurNom,
      auteurId: c.auteurId,
      auteurImage: c.auteur?.image ?? null,
      auteurUsername: c.auteur?.username ?? c.auteur?.name ?? c.auteurNom,
      creeLe: c.creeLe.toISOString(),
    })),
    prixHistorique: listing.prixHistorique.map((ph) => ({
      id: ph.id,
      prix: ph.prix,
      evenement: ph.evenement,
      creeLe: ph.creeLe.toISOString(),
    })),
    auteur: auteurInfo,
  });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const listing = await prisma.listing.findUnique({ where: { id }, select: { auteurId: true, prix: true, titre: true } });
  if (!listing) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }
  if (listing.auteurId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const body = await req.json();
  const { titre, description, prix, statut, anonyme, telephone, images, documents, ...rest } = body;

  // Track price change
  if (prix !== undefined && prix !== listing.prix) {
    const evenement = prix < listing.prix ? "reduction" : "augmentation";
    await prisma.listingPriceHistory.create({
      data: { listingId: id, prix, evenement },
    });

    // Price drop alert — notify users who favorited this listing
    if (prix < listing.prix) {
      const listingTitre = titre ?? listing.titre;
      const oldPrix = listing.prix;
      const newPrix = prix;

      // Fire-and-forget: don't block the response
      (async () => {
        try {
          const favorites = await prisma.listingFavorite.findMany({
            where: { listingId: id },
            select: { userId: true, user: { select: { email: true } } },
          });

          const userIds = favorites.map((f) => f.userId).filter((uid) => uid !== session!.user!.id);
          if (userIds.length === 0) return;

          // Create in-app notifications
          await prisma.notification.createMany({
            data: userIds.map((uid) => ({
              userId: uid,
              type: "price_drop",
              postId: id,
              postTitre: listingTitre,
              acteurNom: "Prix réduit",
            })),
          });

          // Send email notifications
          const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://nidlocal.com";
          const oldFormatted = oldPrix.toLocaleString("fr-CA");
          const newFormatted = newPrix.toLocaleString("fr-CA");
          for (const fav of favorites) {
            if (fav.userId === session!.user!.id) continue;
            if (!fav.user.email) continue;
            sendEmail({
              to: fav.user.email,
              subject: `Baisse de prix : ${listingTitre}`,
              html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e7e2">
    <div style="padding:20px 24px;border-bottom:1px solid #e8e7e2">
      <span style="font-size:18px;font-weight:900;color:#1a1a18">nid</span><span style="font-size:18px;font-weight:900;color:#D4742A">.local</span>
    </div>
    <div style="padding:24px;font-size:14px;line-height:1.6;color:#1a1a18">
      <h2 style="color:#1a1a18;font-size:18px;margin:0 0 12px">Le prix a baisse!</h2>
      <p>Une annonce dans vos favoris vient de baisser de prix :</p>
      <div style="margin:16px 0;padding:16px;background:#f5f4f0;border-radius:8px">
        <p style="margin:0 0 6px;font-weight:600;font-size:15px">${listingTitre.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        <p style="margin:0;color:#6e6c67;font-size:13px">
          <span style="text-decoration:line-through">${oldFormatted}&nbsp;$</span>
          &rarr; <strong style="color:#1D9E75">${newFormatted}&nbsp;$</strong>
        </p>
      </div>
      <a href="${SITE}/annonces/${id}" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#D4742A;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">Voir l'annonce</a>
    </div>
    <div style="padding:16px 24px;border-top:1px solid #e8e7e2;text-align:center">
      <p style="margin:0;font-size:11px;color:#6e6c67">&copy; 2026 nid.local — Fait au Quebec</p>
    </div>
  </div>
</body></html>`,
            }).catch(() => {});
          }
        } catch (err) {
          console.error("[price_drop] notification error:", err);
        }
      })();
    }
  }

  // Update images if provided — delete old ones and create new
  if (images !== undefined && Array.isArray(images)) {
    await prisma.listingImage.deleteMany({ where: { listingId: id } });
    if (images.length > 0) {
      await prisma.listingImage.createMany({
        data: images.map((img: { url: string; principale?: boolean }, i: number) => ({
          listingId: id,
          url: img.url,
          position: i,
          principale: img.principale ?? i === 0,
        })),
      });
    }
  }

  // Update documents if provided
  if (documents !== undefined && Array.isArray(documents)) {
    await prisma.listingDocument.deleteMany({ where: { listingId: id } });
    if (documents.length > 0) {
      await prisma.listingDocument.createMany({
        data: documents.map((doc: { nom: string; url: string; taille?: string }) => ({
          listingId: id,
          nom: doc.nom,
          url: doc.url,
          taille: doc.taille || null,
        })),
      });
    }
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      ...(titre !== undefined && { titre }),
      ...(description !== undefined && { description }),
      ...(prix !== undefined && { prix }),
      ...(statut !== undefined && ["active", "vendu", "retire"].includes(statut) && { statut }),
      ...(anonyme !== undefined && { anonyme }),
      ...(telephone !== undefined && { telephone: telephone || null }),
      ...rest,
    },
  });

  return NextResponse.json({ id: updated.id });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const listing = await prisma.listing.findUnique({ where: { id }, select: { auteurId: true } });
  if (!listing) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }
  if (listing.auteurId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
