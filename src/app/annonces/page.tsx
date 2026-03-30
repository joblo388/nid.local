import type { Metadata } from "next";
import { AnnoncesListeView } from "./AnnoncesListeView";

export const metadata: Metadata = {
  title: "Annonces immobilières",
  description: "Propriétés vendues directement par les propriétaires, sans commission.",
};

export default function AnnoncesPage() {
  return <AnnoncesListeView />;
}
