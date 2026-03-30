import type { Metadata } from "next";
import { PublierAnnonceForm } from "./PublierAnnonceForm";

export const metadata: Metadata = {
  title: "Publier une annonce",
  description: "Publie ta propriété sur nid.local, sans commission.",
};

export default function PublierAnnoncePage() {
  return <PublierAnnonceForm />;
}
