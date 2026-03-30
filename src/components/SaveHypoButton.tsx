"use client";

import { SaveReportButton } from "./SaveReportButton";

function readDOM(id: string): string {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return el?.value ?? "";
}
function readText(id: string): string {
  return document.getElementById(id)?.textContent?.trim() ?? "";
}

export function SaveHypoButton() {
  return (
    <div style={{ marginTop: 16 }}>
      <SaveReportButton
        type="hypothecaire"
        getDonnees={() => ({
          prix: readDOM("price"),
          mise_de_fonds: readDOM("down"),
          taux: readDOM("rate"),
          amortissement: readDOM("amort"),
          type_propriete: readDOM("prop-type"),
        })}
        getResultats={() => ({
          paiementMensuel: readText("payment") + " $ / mois",
          interetsTotaux: readText("total-interest"),
          totalDebourse: readText("total-paid"),
          primeSCHL: readText("cmhc"),
        })}
        getTitre={() => {
          const prix = readDOM("price");
          const pmt = readText("payment");
          return `Hypothèque ${prix} $ | ${pmt} $ / mois`;
        }}
      />
    </div>
  );
}
