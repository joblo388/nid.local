import type { Metadata } from "next";
import { ModifierAnnonceForm } from "./ModifierAnnonceForm";

export const metadata: Metadata = {
  title: "Modifier l'annonce — nid.local",
};

export default function ModifierAnnoncePage() {
  return <ModifierAnnonceForm />;
}
