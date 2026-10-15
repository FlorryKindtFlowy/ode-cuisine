// Formulieren van odecuisine.be (Cloudflare Pages Function, adres: /api/formulier).
// Vervangt FormSubmit: elke inzending gaat via Resend als mail naar de mailbox van Ode.
// Gebruikt dezelfde instellingen als /api/inschrijven:
//   RESEND_API_KEY   (Secret)
//   FORMULIER_NAAR   (Text, optioneel; standaard ode@flowyagency.com)
// Velden die met _ beginnen zijn technisch (_subject, _next, _honey) en komen niet in de mail.

const SITE = 'https://www.odecuisine.be';
const AFZENDER = 'Ode Cuisine <info@odecuisine.be>';
const STANDAARD_NAAR = 'ode@flowyagency.com';
const MAX_BIJLAGE = 15 * 1024 * 1024; // 15 MB in totaal

export async function onRequestPost({ request, env }) {
  let veld;
  try { veld = await request.formData(); } catch { return terug(null, false); }

  const volgende = veilig(String(veld.get('_next') || ''));
  if (String(veld.get('_honey') || '').trim()) return terug(volgende, true); // spamval

  const onderwerp = String(veld.get('_subject') || 'Nieuw bericht via odecuisine.be').slice(0, 150);
  const rijen = [];
  const bijlagen = [];
  let totaal = 0;
  let replyTo = '';

  for (const [naam, waarde] of veld.entries()) {
    if (naam.startsWith('_')) continue;
    if (typeof waarde === 'object' && waarde && 'arrayBuffer' in waarde) {
      if (!waarde.size) continue;
      totaal += waarde.size;
      if (totaal > MAX_BIJLAGE) { rijen.push([naam, `(bijlage ${waarde.name} te groot, niet meegestuurd)`]); continue; }
      bijlagen.push({ filename: waarde.name || 'bijlage', content: base64(await waarde.arrayBuffer()) });
      rijen.push([naam, `bijlage: ${waarde.name}`]);
      continue;
    }
    const tekst = String(waarde).trim();
    if (!tekst) continue;
    if (naam === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(tekst)) replyTo = tekst;
    rijen.push([naam, tekst.slice(0, 5000)]);
  }

  if (!env.RESEND_API_KEY) { console.log('formulier: RESEND_API_KEY ontbreekt'); return terug(volgende, false); }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: AFZENDER,
      to: [env.FORMULIER_NAAR || STANDAARD_NAAR],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject: onderwerp,
      html: mail(onderwerp, rijen),
      ...(bijlagen.length ? { attachments: bijlagen } : {}),
    }),
  });
  if (!res.ok) { console.log('formulier: Resend', res.status, await res.text()); return terug(volgende, false); }
  return terug(volgende, true);
}

export function onRequestGet() {
  return Response.redirect(`${SITE}/`, 302);
}

function terug(volgende, ok) {
  if (ok) return Response.redirect(volgende || `${SITE}/bedankt/`, 303);
  return Response.redirect(`${SITE}/bedankt/?mislukt`, 303);
}

function veilig(url) {
  if (url.startsWith(`${SITE}/`)) return url;
  if (url.startsWith('/') && !url.startsWith('//')) return SITE + url;
  return '';
}

function base64(buffer) {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

function label(naam) {
  return naam.replace(/_/g, ' ');
}

function mail(onderwerp, rijen) {
  const sans = "'Helvetica Neue', Arial, sans-serif";
  const regels = rijen.map(([k, v]) => `<tr>
    <td style="padding:10px 14px;border-bottom:1px solid #d6dfe9;font-family:${sans};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#51121a;vertical-align:top;white-space:nowrap;">${esc(label(k))}</td>
    <td style="padding:10px 14px;border-bottom:1px solid #d6dfe9;font-family:${sans};font-size:15px;line-height:1.6;color:#2a0a10;">${esc(v)}</td>
  </tr>`).join('');
  return `<!doctype html><html lang="nl"><body style="margin:0;background:#e3ebf3;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e3ebf3;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:100%;background:#ffffff;">
  <tr><td style="background:#51121a;padding:22px 24px;font-family:Georgia,serif;font-size:22px;color:#e8eef5;">${esc(onderwerp)}</td></tr>
  <tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${regels}</table></td></tr>
  <tr><td style="padding:16px 24px;font-family:${sans};font-size:12px;color:#4f3d4a;">Verstuurd via odecuisine.be. Antwoord op deze mail om rechtstreeks te antwoorden aan de inzender.</td></tr>
</table></td></tr></table></body></html>`;
}
