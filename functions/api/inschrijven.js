// Ode Zondag inschrijving (Cloudflare Pages Function, adres: /api/inschrijven).
// Voegt een nieuwe abonnee toe aan Resend en stuurt een welkomstmail.
// Instellingen in Cloudflare › Workers & Pages › ode-cuisine › Settings › Variables and Secrets:
//   RESEND_API_KEY      (Secret)
//   RESEND_SEGMENT_ID   (Text)

const SITE = 'https://www.odecuisine.be';
const AFZENDER = 'Ode Cuisine <zondag@odecuisine.be>';
const ANTWOORD_NAAR = 'ode@flowyagency.com';

export async function onRequestPost({ request, env }) {
  const wilJson = (request.headers.get('Accept') || '').includes('application/json');
  const antwoord = (ok, bericht, detail) => wilJson
    ? Response.json({ ok, bericht, ...(detail ? { detail } : {}) }, { status: ok ? 200 : 400 })
    : Response.redirect(`${SITE}/?zondag=${ok ? 'ingeschreven' : 'mislukt'}#zondagsbrief`, 303);

  let veld;
  try { veld = await request.formData(); } catch { return antwoord(false, 'Er ging iets mis.'); }
  const email = String(veld.get('email') || '').trim().toLowerCase();
  const voornaam = String(veld.get('voornaam') || '').trim().slice(0, 60);

  if (veld.get('website')) return antwoord(true, 'Merci!'); // spamval
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    return antwoord(false, 'Dat e-mailadres klopt niet helemaal.');
  }
  if (!env.RESEND_API_KEY || !env.RESEND_SEGMENT_ID) {
    return antwoord(false, 'De inschrijving staat nog niet open. Probeer je het straks nog eens?');
  }

  const resend = (pad, body) => fetch(`https://api.resend.com${pad}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const res = await resend('/contacts', {
    email,
    ...(voornaam ? { first_name: voornaam } : {}),
    unsubscribed: false,
    segments: [{ id: env.RESEND_SEGMENT_ID }],
  });
  if (!res.ok && res.status !== 409) {
    const fout = await res.text();
    console.log('Resend contacts', res.status, fout);
    return antwoord(false, 'Er ging iets mis. Probeer je het straks nog eens?', `${res.status} ${fout.slice(0, 300)}`);
  }
  if (res.ok) {
    await resend('/emails', {
      from: AFZENDER, to: [email], reply_to: ANTWOORD_NAAR,
      subject: 'Je plekje aan tafel is gedekt', html: welkom(voornaam),
    }).catch(() => {});
  }
  return antwoord(true, 'ok');
}

export function onRequestGet({ request, env }) {
  // ?status vertelt de site of de inschrijving al openstaat (Resend ingesteld).
  if (new URL(request.url).searchParams.has('status')) {
    return Response.json({ open: Boolean(env.RESEND_API_KEY && env.RESEND_SEGMENT_ID) });
  }
  return Response.redirect(`${SITE}/#zondagsbrief`, 302);
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function welkom(voornaam) {
  const serif = "'Cormorant Garamond', Georgia, serif";
  const sans = "'Jost', 'Helvetica Neue', Arial, sans-serif";
  const aanhef = voornaam ? `Dag ${esc(voornaam)},` : 'Dag lieve lezer,';
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Jost:wght@300;400&display=swap" rel="stylesheet"></head>
<body style="margin:0;background:#a4b9ce;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#a4b9ce;"><tr><td align="center" style="padding:28px 12px 40px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;">
  <tr><td align="center" style="background:#51121a;padding:60px 40px 50px;">
    <img src="${SITE}/mail/ode-o-creme.png" width="34" height="39" alt="Ode" style="display:block;margin:0 auto 26px;border:0;">
    <div style="font-family:${sans};font-size:11px;letter-spacing:3.5px;text-transform:uppercase;color:#a4b9ce;">Ode Zondag</div>
    <h1 style="margin:18px 0 0;font-family:${serif};font-weight:400;font-size:48px;line-height:1.05;color:#e8eef5;">Je plekje aan tafel is <em>gedekt</em></h1>
  </td></tr>
  <tr><td style="background:#e3ebf3;padding:48px 52px 44px;">
    <p style="margin:0 0 16px;font-family:${serif};font-style:italic;font-size:24px;color:#51121a;">${aanhef}</p>
    <p style="margin:0 0 16px;font-family:${sans};font-weight:300;font-size:16px;line-height:1.75;color:#2a0a10;">Fijn dat je aanschuift. Vanaf nu ligt er elke zondagochtend een recept in je mailbox. Elk recept is een ode aan iemand: een papa, een oma, een vriendin. Met het verhaal erbij, en alles wat je nodig hebt om het zelf op tafel te zetten.</p>
    <p style="margin:0 0 30px;font-family:${sans};font-weight:300;font-size:16px;line-height:1.75;color:#2a0a10;">Kan je niet wachten tot zondag? Op de site staan de recepten van de vorige weken al klaar.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td bgcolor="#51121a">
      <a href="${SITE}/recepten/?utm_source=nieuwsbrief&utm_medium=email&utm_campaign=welkom" style="display:inline-block;padding:17px 32px;font-family:${sans};font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#e8eef5;text-decoration:none;">Bekijk de recepten</a>
    </td></tr></table>
    <p style="margin:34px 0 0;font-family:${serif};font-style:italic;font-size:22px;color:#51121a;">Tot sebiet,<br>Florry &amp; Gilles</p>
  </td></tr>
  <tr><td align="center" style="background:#380b12;padding:30px 40px;font-family:${sans};font-weight:300;font-size:12px;line-height:1.7;color:#a4b9ce;">
    Je krijgt deze mail omdat je je inschreef voor Ode Zondag op odecuisine.be.<br>Ode Cuisine, een project van Flowy Agency BV, Tabakvest 87 bus 4896, 2000 Antwerpen
  </td></tr>
</table></td></tr></table></body></html>`;
}
