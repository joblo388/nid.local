// Email service wrapper — uses Resend if RESEND_API_KEY is set, logs to console otherwise.
// To enable: npm install resend, set RESEND_API_KEY and RESEND_FROM in .env

const FROM = process.env.RESEND_FROM ?? "nid.local <noreply@nid.local>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: FROM, to, subject, html });
  } else {
    console.log(`[email] To: ${to}\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, "")}`);
  }
}

export function resetPasswordEmail(resetUrl: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="color:#1a1a18">Réinitialiser votre mot de passe</h2>
      <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe. Ce lien expire dans <strong>1 heure</strong>.</p>
      <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#1D9E75;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
        Réinitialiser mon mot de passe
      </a>
      <p style="color:#6e6c67;font-size:13px">Si vous n'avez pas fait cette demande, ignorez ce courriel.</p>
    </div>
  `;
}

export function verifyEmailContent(verifyUrl: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="color:#1a1a18">Vérifiez votre adresse courriel</h2>
      <p>Bienvenue sur <strong>nid.local</strong> ! Cliquez sur le lien ci-dessous pour confirmer votre adresse.</p>
      <a href="${verifyUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#1D9E75;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
        Vérifier mon courriel
      </a>
      <p style="color:#6e6c67;font-size:13px">Ce lien expire dans 24 heures.</p>
    </div>
  `;
}
