import type { Metadata } from "next";
import { ModifierAnnonceForm } from "./ModifierAnnonceForm";

export const metadata: Metadata = {
  title: "Modifier l'annonce",
};

export default function ModifierAnnoncePage() {
  return <ModifierAnnonceForm />;
}
