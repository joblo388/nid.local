import type { Metadata } from "next";
import PublierFormClient from "./PublierFormClient";

export const metadata: Metadata = {
  title: "Publier une annonce",
  description: "Publie ta propriété sur nid.local, sans commission.",
};

export default function PublierAnnoncePage() {
  return <PublierFormClient />;
}
