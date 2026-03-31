import type { Metadata } from "next";
import { AnnoncesListeView } from "./AnnoncesListeView";

export const metadata: Metadata = {
  title: "Annonces immobili\u00e8res",
  description: "Propri\u00e9t\u00e9s vendues directement par les propri\u00e9taires, sans commission.",
};

export default function AnnoncesPage() {
  return <AnnoncesListeView />;
}
