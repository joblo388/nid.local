import type { Metadata } from "next";
import { Suspense } from "react";
import { ComparerView } from "./ComparerView";

export const metadata: Metadata = {
  title: "Comparer des annonces",
  description: "Comparaison côte à côte de propriétés sur nid.local",
};

export default function ComparerPage() {
  return (
    <Suspense>
      <ComparerView />
    </Suspense>
  );
}
