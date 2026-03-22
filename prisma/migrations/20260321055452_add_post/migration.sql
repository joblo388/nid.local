-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "auteurNom" TEXT NOT NULL,
    "auteurId" TEXT,
    "quartierSlug" TEXT NOT NULL,
    "villeSlug" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "nbCommentaires" INTEGER NOT NULL DEFAULT 0,
    "nbVotes" INTEGER NOT NULL DEFAULT 0,
    "nbVues" INTEGER NOT NULL DEFAULT 0,
    "epingle" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Post_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
