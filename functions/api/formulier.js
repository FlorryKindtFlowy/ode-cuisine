// Formulieren van odecuisine.be (Cloudflare Pages Function, adres: /api/formulier).
// Vervangt FormSubmit: elke inzending gaat via Resend als mail naar de mailbox van Ode.
// Gebruikt dezelfde instellingen als /api/inschrijven:
//   RESEND_API_KEY   (Secret)
//   FORMULIER_NAAR   (Text, optioneel; standaard ode@flowyagency.com)
// Velden die met _ beginnen zijn technisch (_subject, _next, _honey, _bevestiging) en komen niet in de mail.
// _bevestiging="ode-aan" stuurt de inzender ook een bedankmail (zie BEVESTIGINGEN onderaan).

const SITE = 'https://www.odecuisine.be';
const AFZENDER = 'Ode Cuisine <info@odecuisine.be>';
const STANDAARD_NAAR = 'ode@flowyagency.com';
const MAX_BIJLAGE = 15 * 1024 * 1024; // 15 MB in totaal
const ANTWOORD_NAAR = 'ode@flowyagency.com'; // waar antwoorden op de bedankmail landen

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

  // Bedankmail naar de inzender (enkel voor formulieren met _bevestiging).
  const soort = BEVESTIGINGEN[String(veld.get('_bevestiging') || '')];
  if (soort && replyTo) {
    const gegevens = Object.fromEntries(rijen);
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: AFZENDER,
        to: [replyTo],
        reply_to: env.FORMULIER_NAAR || ANTWOORD_NAAR,
        subject: soort.onderwerp,
        html: soort.html(gegevens),
      }),
    }).catch((e) => { console.log('bedankmail: fout', e); return null; });
    if (r && !r.ok) console.log('bedankmail: Resend', r.status, await r.text());
  }
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

// ---------- Bedankmails naar de inzender ----------

const TERMIJN = 'binnen de week'; // pas hier aan als je een andere termijn wil beloven

const BEVESTIGINGEN = {
  'ode-aan': {
    onderwerp: 'Merci voor je verhaal · Ode Cuisine',
    html: bedanktOdeAan,
  },
};

function bedanktOdeAan(g) {
  const serif = "'Cormorant Garamond', Georgia, serif";
  const sans = "'Jost', 'Helvetica Neue', Arial, sans-serif";
  const p = `margin:0 0 16px;font-family:${sans};font-weight:300;font-size:16px;line-height:1.75;color:#2a0a10;`;
  const voornaam = String(g.naam || '').split(/\s+/)[0];
  const aanhef = voornaam ? `Dag ${esc(voornaam)},` : 'Dag,';
  const wat = g.gerecht ? `Je recept voor <em>${esc(g.gerecht)}</em> is goed aangekomen` : 'Je recept is goed aangekomen';
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Jost:wght@300;400&display=swap" rel="stylesheet"></head>
<body style="margin:0;background:#a4b9ce;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#a4b9ce;"><tr><td align="center" style="padding:28px 12px 40px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;">
  <tr><td align="center" style="background:#51121a;padding:60px 40px 50px;">
    <img src="${SITE}/mail/ode-o-creme.png" width="34" height="39" alt="Ode" style="display:block;margin:0 auto 26px;border:0;">
    <div style="font-family:${sans};font-size:11px;letter-spacing:3.5px;text-transform:uppercase;color:#a4b9ce;">Ode aan</div>
    <h1 style="margin:18px 0 0;font-family:${serif};font-weight:400;font-size:48px;line-height:1.05;color:#e8eef5;">Merci voor je <em>verhaal</em></h1>
  </td></tr>
  <tr><td style="background:#e3ebf3;padding:48px 52px 44px;">
    <p style="margin:0 0 16px;font-family:${serif};font-style:italic;font-size:24px;color:#51121a;">${aanhef}</p>
    <p style="${p}">Wat fijn dat je jouw verhaal met mij deelt. ${wat} en zit veilig in de pot.</p>
    <p style="${p}">Ik lees elk verhaal met heel veel liefde. ${TERMIJN.charAt(0).toUpperCase() + TERMIJN.slice(1)} hoor je van mij. Dan spreken we samen een datum af om bij jou thuis te komen filmen.</p>
    <p style="margin:0 0 30px;font-family:${sans};font-weight:300;font-size:16px;line-height:1.75;color:#2a0a10;">Wil je intussen nog iets aanvullen, een extra foto sturen of een datum aanpassen? Antwoord gewoon op deze mail.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td bgcolor="#51121a">
      <a href="${SITE}/ode-aan/?utm_source=bedankmail&utm_medium=email&utm_campaign=ode-aan" style="display:inline-block;padding:17px 32px;font-family:${sans};font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#e8eef5;text-decoration:none;">Bekijk Ode aan</a>
    </td></tr></table>
    <p style="margin:34px 0 0;font-family:${serif};font-style:italic;font-size:22px;color:#51121a;">Tot sebiet,<br>Florry</p>
  </td></tr>
  <tr><td align="center" style="background:#380b12;padding:30px 40px;font-family:${sans};font-weight:300;font-size:12px;line-height:1.7;color:#a4b9ce;">
    Je krijgt deze mail omdat je een verhaal instuurde voor Ode aan op odecuisine.be.<br>Ode Cuisine, een project van Flowy Agency BV, Tabakvest 87 bus 4896, 2000 Antwerpen
  </td></tr>
</table></td></tr></table></body></html>`;
}
