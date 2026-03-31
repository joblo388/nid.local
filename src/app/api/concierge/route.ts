import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

const API_KEY = process.env.SENDGRID_API_KEY;
const FROM = process.env.SENDGRID_FROM_EMAIL || "noreply@nidlocal.com";

if (API_KEY) sgMail.setApiKey(API_KEY);

export async function POST(req: Request) {
  try {
    const fd = await req.formData();

    const prix = fd.get("prix") as string;
    const adresse = fd.get("adresse") as string;
    const type = fd.get("type") as string;
    const description = fd.get("description") as string;
    const lien = fd.get("lien") as string;
    const nom = fd.get("nom") as string;
    const contact = fd.get("contact") as string;
    const fichiers = fd.getAll("fichiers") as File[];

    /* ── Build attachments ──────────────────────────────────────────── */

    const attachments: { content: string; filename: string; type: string }[] = [];

    for (const file of fichiers) {
      if (!file || typeof file === "string" || file.size === 0) continue;
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        content: buffer.toString("base64"),
        filename: file.name,
        type: file.type || "application/octet-stream",
      });
    }

    /* ── Build email HTML ───────────────────────────────────────────── */

    const rows = [
      { label: "Nom", value: nom },
      { label: "Contact", value: contact },
      { label: "Prix demandé", value: prix ? `${Number(prix).toLocaleString("fr-CA")} $` : "Non spécifié" },
      { label: "Adresse", value: adresse || "Non spécifiée" },
      { label: "Type", value: type || "Non spécifié" },
      { label: "Description", value: description || "Aucune" },
      { label: "Lien existant", value: lien || "Aucun" },
      { label: "Fichiers joints", value: attachments.length > 0 ? `${attachments.length} fichier(s)` : "Aucun" },
    ];

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#1a1a18;font-size:18px;margin:0 0 20px">Nouvelle soumission concierge</h2>
        <table style="width:100%;border-collapse:collapse">
          ${rows
            .map(
              (r) => `
            <tr>
              <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#6e6c67;border-bottom:1px solid #e8e7e2;white-space:nowrap;vertical-align:top">${r.label}</td>
              <td style="padding:8px 12px;font-size:13px;color:#1a1a18;border-bottom:1px solid #e8e7e2;white-space:pre-wrap">${r.value}</td>
            </tr>`
            )
            .join("")}
        </table>
      </div>
    `;

    /* ── Send ────────────────────────────────────────────────────────── */

    if (!API_KEY) {
      console.log("[concierge] Email (no API key):", { nom, contact, prix, adresse, type, description, lien, nbFichiers: attachments.length });
      return NextResponse.json({ ok: true });
    }

    await sgMail.send({
      to: FROM,
      from: { email: FROM, name: "nid.local" },
      subject: `Concierge: ${nom || "Sans nom"} - ${adresse || "Adresse non spécifiée"}`,
      html,
      ...(attachments.length > 0 ? { attachments } : {}),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[concierge] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
