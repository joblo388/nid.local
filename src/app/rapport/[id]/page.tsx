import type { Metadata } from "next";
import { RapportView } from "./RapportView";

export const metadata: Metadata = { title: "Rapport — nid.local" };

export default function RapportPage() {
  return <RapportView />;
}
