import type { Metadata } from "next";
import { RapportView } from "./RapportView";

export const metadata: Metadata = { title: "Rapport" };

export default function RapportPage() {
  return <RapportView />;
}
