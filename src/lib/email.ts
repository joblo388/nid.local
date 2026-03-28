import sgMail from "@sendgrid/mail";
import { prisma } from "@/lib/prisma";

const API_KEY = process.env.SENDGRID_API_KEY;
const FROM = process.env.SENDGRID_FROM_EMAIL || "noreply@nidlocal.com";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://nidlocal.com";

if (API_KEY) sgMail.setApiKey(API_KEY);

// ─── Low-level send (used by auth emails too) ───────────────────────────────

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!API_KEY) {
    console.log(`[email] To: ${to}\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, "")}`);
    return;
  }
  await sgMail.send({ to, from: { email: FROM, name: "nid.local" }, subject, html });
}

// ─── Auth email templates (unchanged) ────────────────────────────────────────

export function resetPasswordEmail(resetUrl: string): string {
  return wrapHtml(`
    <h2 style="color:#1a1a18;font-size:18px;margin:0 0 12px">Réinitialiser votre mot de passe</h2>
    <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe. Ce lien expire dans <strong>1 heure</strong>.</p>
    <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#1D9E75;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
      Réinitialiser mon mot de passe
    </a>
    <p style="color:#6e6c67;font-size:13px">Si vous n'avez pas fait cette demande, ignorez ce courriel.</p>
  `);
}

export function verifyEmailContent(verifyUrl: string): string {
  return wrapHtml(`
    <h2 style="color:#1a1a18;font-size:18px;margin:0 0 12px">Vérifiez votre adresse courriel</h2>
    <p>Bienvenue sur <strong>nid.local</strong> ! Cliquez sur le lien ci-dessous pour confirmer votre adresse.</p>
    <a href="${verifyUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#1D9E75;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
      Vérifier mon courriel
    </a>
    <p style="color:#6e6c67;font-size:13px">Ce lien expire dans 24 heures.</p>
  `);
}

// ─── Notification emails ─────────────────────────────────────────────────────

type NotifType = "comment" | "reply" | "mention" | "listing_comment" | "message" | "suggestion";

const prefField: Record<NotifType, string> = {
  comment: "emailNotifComments",
  reply: "emailNotifReplies",
  mention: "emailNotifMentions",
  listing_comment: "emailNotifAnnonces",
  message: "emailNotifMessages",
  suggestion: "emailNotifMessages", // admins always get suggestions
};

interface NotifEmailData {
  type: NotifType;
  recipientUserId: string;
  acteurNom: string;
  postTitre: string;
  postId: string;
}

const templates: Record<NotifType, { subject: (d: NotifEmailData) => string; body: (d: NotifEmailData) => string }> = {
  comment: {
    subject: (d) => `${d.acteurNom} a commenté votre post`,
    body: (d) => `
      <p><strong>${esc(d.acteurNom)}</strong> a commenté votre post :</p>
      <p style="color:#6e6c67;font-style:italic">${esc(d.postTitre)}</p>
      ${cta(`${SITE}/post/${d.postId}`, "Voir le commentaire")}
    `,
  },
  reply: {
    subject: (d) => `${d.acteurNom} a répondu à votre commentaire`,
    body: (d) => `
      <p><strong>${esc(d.acteurNom)}</strong> a répondu à votre commentaire sur :</p>
      <p style="color:#6e6c67;font-style:italic">${esc(d.postTitre)}</p>
      ${cta(`${SITE}/post/${d.postId}`, "Voir la réponse")}
    `,
  },
  mention: {
    subject: (d) => `${d.acteurNom} vous a mentionné`,
    body: (d) => `
      <p><strong>${esc(d.acteurNom)}</strong> vous a mentionné dans une discussion :</p>
      <p style="color:#6e6c67;font-style:italic">${esc(d.postTitre)}</p>
      ${cta(`${SITE}/post/${d.postId}`, "Voir la discussion")}
    `,
  },
  listing_comment: {
    subject: (d) => `${d.acteurNom} a commenté votre annonce`,
    body: (d) => `
      <p><strong>${esc(d.acteurNom)}</strong> a commenté votre annonce :</p>
      <p style="color:#6e6c67;font-style:italic">${esc(d.postTitre)}</p>
      ${cta(`${SITE}/annonces/${d.postId}`, "Voir l'annonce")}
    `,
  },
  message: {
    subject: (d) => `Nouveau message de ${d.acteurNom}`,
    body: (d) => `
      <p><strong>${esc(d.acteurNom)}</strong> vous a envoyé un message privé.</p>
      ${cta(`${SITE}/messages`, "Lire le message")}
    `,
  },
  suggestion: {
    subject: (d) => `Nouvelle suggestion : ${d.postTitre}`,
    body: (d) => `
      <p><strong>${esc(d.acteurNom)}</strong> a soumis une suggestion :</p>
      <p style="color:#6e6c67;font-style:italic">${esc(d.postTitre)}</p>
      ${cta(`${SITE}/admin`, "Voir dans l'admin")}
    `,
  },
};

/**
 * Send a notification email (fire-and-forget).
 * Checks user preferences before sending.
 */
export async function sendNotifEmail(data: NotifEmailData): Promise<void> {
  if (!API_KEY) return;

  try {
    const user = await prisma.user.findUnique({
      where: { id: data.recipientUserId },
      select: {
        email: true,
        emailNotifComments: true,
        emailNotifReplies: true,
        emailNotifMentions: true,
        emailNotifMessages: true,
        emailNotifAnnonces: true,
      },
    });
    if (!user?.email) return;

    // Check user preference
    const field = prefField[data.type] as keyof typeof user;
    if (user[field] === false) return;

    const template = templates[data.type];
    await sgMail.send({
      to: user.email,
      from: { email: FROM, name: "nid.local" },
      subject: template.subject(data),
      html: wrapHtml(template.body(data)),
    });
  } catch (err) {
    console.error("[email] SendGrid error:", err);
  }
}

/**
 * Send notification emails to multiple users at once.
 */
export async function sendNotifEmailBulk(
  userIds: string[],
  data: Omit<NotifEmailData, "recipientUserId">,
): Promise<void> {
  for (const uid of userIds) {
    sendNotifEmail({ ...data, recipientUserId: uid }).catch(() => {});
  }
}

// ─── Marketplace alert email ─────────────────────────────────────────────────

interface AlertEmailData {
  recipientEmail: string;
  listingTitre: string;
  listingId: string;
  listingPrix: number;
  listingType: string;
  listingQuartier: string;
}

export async function sendAlertEmail(data: AlertEmailData): Promise<void> {
  const prixFormatted = data.listingPrix.toLocaleString("fr-CA");
  const typeLabel: Record<string, string> = {
    unifamiliale: "Unifamiliale", condo: "Condo", duplex: "Duplex",
    triplex: "Triplex", quadruplex: "Quadruplex",
  };
  const html = wrapHtml(`
    <h2 style="color:#1a1a18;font-size:18px;margin:0 0 12px">Nouvelle annonce correspondant à votre alerte</h2>
    <p>Une nouvelle annonce vient d'être publiée qui correspond à vos critères :</p>
    <div style="margin:16px 0;padding:16px;background:#f5f4f0;border-radius:8px">
      <p style="margin:0 0 6px;font-weight:600;font-size:15px">${esc(data.listingTitre)}</p>
      <p style="margin:0;color:#6e6c67;font-size:13px">
        ${prixFormatted}&nbsp;$ · ${typeLabel[data.listingType] ?? data.listingType} · ${esc(data.listingQuartier)}
      </p>
    </div>
    ${cta(`${SITE}/annonces/${data.listingId}`, "Voir l'annonce")}
    <p style="color:#6e6c67;font-size:12px;margin-top:20px">
      Vous recevez ce courriel car vous avez créé une alerte marketplace sur nid.local.
      <a href="${SITE}/alertes" style="color:#1D9E75">Gérer mes alertes</a>
    </p>
  `);

  await sendEmail({
    to: data.recipientEmail,
    subject: `Nouvelle annonce : ${data.listingTitre}`,
    html,
  });
}

// ─── HTML wrapper ────────────────────────────────────────────────────────────

function wrapHtml(content: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e7e2">
    <div style="padding:20px 24px;border-bottom:1px solid #e8e7e2">
      <span style="font-size:18px;font-weight:900;color:#1a1a18">nid</span><span style="font-size:18px;font-weight:900;color:#1D9E75">.local</span>
    </div>
    <div style="padding:24px;font-size:14px;line-height:1.6;color:#1a1a18">
      ${content}
    </div>
    <div style="padding:16px 24px;border-top:1px solid #e8e7e2;text-align:center">
      <p style="margin:0;font-size:11px;color:#6e6c67">© 2026 nid.local — Fait au Québec</p>
    </div>
  </div>
</body></html>`;
}

function cta(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#1D9E75;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">${label}</a>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
