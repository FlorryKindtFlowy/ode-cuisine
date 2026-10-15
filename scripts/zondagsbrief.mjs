// Ode Zondag: de wekelijkse nieuwsbrief met het recept van die zondag.
//
// Gebruik:
//   node scripts/zondagsbrief.mjs                         preview van het eerstvolgende recept
//   node scripts/zondagsbrief.mjs --recept tiramisu-van-oma    preview van één recept
//   node scripts/zondagsbrief.mjs --test jij@mail.be      testmail naar één adres (via Resend)
//   node scripts/zondagsbrief.mjs --verstuur              verstuurt het recept van vandaag naar alle abonnees
//
// Nodig om te versturen (GitHub › Settings › Secrets and variables › Actions):
//   RESEND_API_KEY      de API key uit Resend
//   RESEND_SEGMENT_ID   het id van het segment "Ode Zondag" in Resend
//
// Extra velden die je per recept bovenaan in de Markdown kan zetten (allemaal optioneel):
//   onderwerp:  eigen onderwerpregel voor de mail
//   brief:      een persoonlijk woordje van Florry voor die week
//   youtube:    link naar de video op YouTube
//   instagram:  link naar de reel of post
//   tiktok:     link naar de TikTok
//   pinterest:  link naar de pin

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// ---------- instellingen ----------
const SITE = 'https://www.odecuisine.be';
const AFZENDER = 'Ode Cuisine <zondag@odecuisine.be>';
const ANTWOORD_NAAR = 'ode@flowyagency.com';
const AFZENDER_ADRES = 'Ode Cuisine, een project van Flowy Agency BV, Tabakvest 87 bus 4896, 2000 Antwerpen';
// Vaste profielen. Laat leeg ('') zolang een kanaal nog niet bestaat.
const PROFIELEN = {
  instagram: '',
  youtube: '',
  tiktok: '',
  pinterest: '',
};

const KLEUR = {
  wijn: '#51121a', wijnDiep: '#380b12', zand: '#a4b9ce', zandLicht: '#c3d2e0',
  room: '#e3ebf3', creme: '#e8eef5', inkt: '#2a0a10', zacht: '#4f3d4a',
};
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS = "'Jost', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const MAP = path.resolve('src/content/recepten');
const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

// ---------- recepten inlezen ----------
function leesRecepten() {
  return fs.readdirSync(MAP)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(MAP, f), 'utf8'));
      return { slug: f.replace(/\.md$/, ''), ...data, datumIso: isoDag(new Date(data.datum)), body: content };
    })
    .sort((a, b) => a.datumIso.localeCompare(b.datumIso));
}

function isoDag(d) { return d.toISOString().slice(0, 10); }
function vandaagBrussel() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Brussels' }).format(new Date());
}
function mooieDatum(iso) {
  const [j, m, d] = iso.split('-').map(Number);
  return `${d} ${MAANDEN[m - 1]} ${j}`;
}
function korteDatum(iso) {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MAANDEN[m - 1].slice(0, 3)}`;
}
function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function utm(url, slug) {
  const u = new URL(url, SITE);
  u.searchParams.set('utm_source', 'nieuwsbrief');
  u.searchParams.set('utm_medium', 'email');
  u.searchParams.set('utm_campaign', `ode-zondag-${slug}`);
  return u.toString();
}
// Zet het familiewoord (of anders het laatste woord) van de titel in cursief, zoals op de site.
function titelMetCursief(titel, familie) {
  const t = esc(titel);
  if (familie && t.toLowerCase().includes(familie.toLowerCase())) {
    const i = t.toLowerCase().lastIndexOf(familie.toLowerCase());
    return `${t.slice(0, i)}<em>${t.slice(i, i + familie.length)}</em>${t.slice(i + familie.length)}`;
  }
  const delen = t.split(' ');
  const laatste = delen.pop();
  return `${delen.join(' ')} <em>${laatste}</em>`;
}

// ---------- de mail ----------
export function maakMail(r, nummer) {
  const url = utm(`/recepten/${r.slug}/`, r.slug);
  const odeAan = utm('/ode-aan/', r.slug).replace(/$/, '#inzenden');
  const onderwerp = r.onderwerp || `Ode Zondag: ${r.titel}`;
  const preheader = r.beschrijving || '';
  const brief = r.brief ? esc(r.brief) : `Elke zondag zetten we één recept op tafel, met het verhaal van de persoon erachter. ${esc(r.beschrijving || '')}`;
  const totaal = (r.voorbereiding || 0) + (r.bereiding || 0);

  const kanalen = [
    ['Bekijk de video', r.youtube || PROFIELEN.youtube, 'YouTube'],
    ['Bekijk de reel', r.instagram || PROFIELEN.instagram, 'Instagram'],
    ['Bekijk de TikTok', r.tiktok || PROFIELEN.tiktok, 'TikTok'],
    ['Bewaar de pin', r.pinterest || PROFIELEN.pinterest, 'Pinterest'],
  ].filter(([, link]) => link);

  const kicker = (tekst, kleur) =>
    `<div style="font-family:${SANS};font-size:11px;letter-spacing:3.5px;text-transform:uppercase;color:${kleur};">${tekst}</div>`;

  // Ingrediënten als "Mosterddillesaus: 1 eetlepel honing" krijgen een eigen tussenkopje.
  let groep = '';
  const ingredienten = (r.ingredienten || []).map((regel, n) => {
    const m = String(regel).match(/^([^:]{2,30}):\s*(.+)$/);
    const naam = m ? m[1] : '';
    const tekst = m ? m[2] : regel;
    let kop = '';
    if (naam !== groep) {
      groep = naam;
      kop = `
            <tr><td colspan="2" style="padding:26px 0 4px;font-family:${SERIF};font-style:italic;font-size:20px;color:${KLEUR.wijn};">${esc(naam || 'en verder')}</td></tr>`;
    }
    return `${kop}
            <tr>
              <td width="34" valign="top" style="padding:11px 0;border-bottom:1px solid rgba(81,18,26,.18);font-family:${SERIF};font-style:italic;font-size:17px;color:${KLEUR.wijn};">${String(n + 1).padStart(2, '0')}</td>
              <td valign="top" style="padding:11px 0;border-bottom:1px solid rgba(81,18,26,.18);font-family:${SANS};font-weight:300;font-size:15px;line-height:1.5;color:${KLEUR.inkt};">${esc(tekst)}</td>
            </tr>`;
  }).join('');

  const kanaalKnoppen = kanalen.map(([tekst, link, naam]) => `
              <td align="center" style="padding:0 6px 12px;">
                <a href="${esc(link)}" style="display:block;padding:12px 16px;border:1px solid ${KLEUR.wijn};font-family:${SANS};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${KLEUR.wijn};text-decoration:none;">${tekst}<br><span style="font-family:${SERIF};font-style:italic;font-size:15px;letter-spacing:0;text-transform:none;">op ${naam}</span></a>
              </td>`).join('');

  const html = `<!doctype html>
<html lang="nl" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${esc(onderwerp)}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Jost:wght@300;400&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; background:${KLEUR.zand}; }
  a { color:${KLEUR.wijn}; }
  em { font-style:italic; }
  @media (max-width:620px) {
    .kader { width:100% !important; }
    .pad { padding-left:26px !important; padding-right:26px !important; }
    .titel { font-size:42px !important; }
    .stat div { font-size:24px !important; }
    .stat div + div { font-size:9px !important; letter-spacing:2px !important; }
    .kop-tekst div { font-size:9px !important; letter-spacing:2px !important; }
    .kanaal td { display:block !important; width:100% !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${KLEUR.zand};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${KLEUR.zand};">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${KLEUR.zand};">
<tr><td align="center" style="padding:28px 12px 40px;">

  <table role="presentation" class="kader" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

    <!-- kop -->
    <tr><td class="pad" style="padding:6px 44px 26px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="kop-tekst" width="33%" valign="middle">${kicker('Ode Zondag', KLEUR.wijn)}</td>
        <td width="34%" align="center" valign="middle"><a href="${utm('/', r.slug)}"><img src="${SITE}/mail/ode-o-wijn.png" width="34" height="39" alt="Ode" style="display:block;border:0;"></a></td>
        <td class="kop-tekst" width="33%" align="right" valign="middle">${kicker(`N&ordm; ${nummer} &middot; ${korteDatum(r.datumIso)}`, KLEUR.wijn)}</td>
      </tr></table>
    </td></tr>

    <!-- hero -->
    <tr><td class="pad" align="center" style="background:${KLEUR.wijn};padding:64px 44px 54px;">
      ${kicker('Het recept van deze zondag', KLEUR.zand)}
      <h1 class="titel" style="margin:22px 0 18px;font-family:${SERIF};font-weight:400;font-size:56px;line-height:1.02;letter-spacing:-0.5px;color:${KLEUR.creme};">${titelMetCursief(r.titel, r.familie)}</h1>
      ${r.slash ? `<div style="font-family:${SANS};font-size:12px;letter-spacing:4px;text-transform:uppercase;color:${KLEUR.zand};">${esc(r.slash)}</div>` : ''}
      ${r.familie ? `<div style="margin-top:30px;font-family:${SERIF};font-style:italic;font-size:21px;color:${KLEUR.zandLicht};">een ode aan ${esc(r.familie)}</div>` : ''}
      ${r.foto ? `<img src="${SITE}/mail/fotos/${path.basename(r.foto).replace(/\.\w+$/, '.jpg')}" width="512" alt="${esc(r.fotoAlt || r.titel)}" style="display:block;width:100%;max-width:512px;height:auto;margin:38px auto 0;border:0;">` : ''}
    </td></tr>

    <!-- cijfers -->
    <tr><td style="background:${KLEUR.wijnDiep};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="stat stat-eerste" width="33%" align="center" style="padding:20px 8px;">
          <div style="font-family:${SERIF};font-size:30px;color:${KLEUR.creme};">${r.porties}</div>${kicker('personen', KLEUR.zand)}</td>
        <td class="stat" width="34%" align="center" style="padding:20px 8px;border-left:1px solid rgba(232,238,245,.25);">
          <div style="font-family:${SERIF};font-size:30px;color:${KLEUR.creme};">${totaal} min</div>${kicker('in totaal', KLEUR.zand)}</td>
        <td class="stat" width="33%" align="center" style="padding:20px 8px;border-left:1px solid rgba(232,238,245,.25);">
          <div style="font-family:${SERIF};font-size:30px;color:${KLEUR.creme};">${r.bereiding} min</div>${kicker('op het vuur', KLEUR.zand)}</td>
      </tr></table>
    </td></tr>

    <!-- brief -->
    <tr><td class="pad" style="background:${KLEUR.room};padding:54px 56px 20px;">
      <p style="margin:0 0 18px;font-family:${SERIF};font-style:italic;font-size:24px;line-height:1.3;color:${KLEUR.wijn};">Dag lieve lezer,</p>
      <p style="margin:0 0 22px;font-family:${SANS};font-weight:300;font-size:16px;line-height:1.75;color:${KLEUR.inkt};">${brief}</p>
    </td></tr>

    <!-- verhaal als briefje -->
    ${r.verhaal ? `
    <tr><td class="pad" style="background:${KLEUR.room};padding:10px 56px 46px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${KLEUR.creme};border:1px solid rgba(81,18,26,.25);">
        <tr><td style="padding:30px 34px 28px;">
          <div style="font-family:${SERIF};font-size:64px;line-height:.6;color:${KLEUR.wijn};height:30px;">&ldquo;</div>
          <p style="margin:0 0 16px;font-family:${SERIF};font-style:italic;font-size:21px;line-height:1.45;color:${KLEUR.inkt};">${esc(r.verhaal)}</p>
          ${kicker(r.familie ? `het verhaal achter het recept van ${esc(r.familie)}` : 'het verhaal achter het recept', KLEUR.zacht)}
        </td></tr>
      </table>
      <p style="margin:26px 0 0;font-family:${SERIF};font-style:italic;font-size:22px;color:${KLEUR.wijn};">Florry</p>
    </td></tr>` : ''}

    <!-- ingredienten -->
    <tr><td class="pad" style="background:${KLEUR.creme};padding:54px 56px 46px;">
      ${kicker('Wat je nodig hebt', KLEUR.zacht)}
      <h2 style="margin:14px 0 18px;font-family:${SERIF};font-weight:400;font-size:36px;line-height:1.05;color:${KLEUR.inkt};">Op je <em style="color:${KLEUR.wijn};">boodschappenlijst</em></h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${ingredienten}
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:38px auto 0;">
        <tr><td align="center" bgcolor="${KLEUR.wijn}" style="background:${KLEUR.wijn};">
          <a href="${url}" style="display:inline-block;padding:18px 34px;font-family:${SANS};font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${KLEUR.creme};text-decoration:none;">Naar de bereiding</a>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;text-align:center;font-family:${SERIF};font-style:italic;font-size:17px;color:${KLEUR.zacht};">stap voor stap, op odecuisine.be</p>
    </td></tr>

    ${kanalen.length ? `
    <!-- kanalen -->
    <tr><td class="pad" align="center" style="background:${KLEUR.zandLicht};padding:44px 44px 34px;">
      ${kicker('Deze week ook te zien', KLEUR.wijn)}
      <h2 style="margin:12px 0 24px;font-family:${SERIF};font-weight:400;font-size:30px;color:${KLEUR.inkt};">Kook met ons <em style="color:${KLEUR.wijn};">mee</em></h2>
      <table role="presentation" class="kanaal" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${kanaalKnoppen}
      </tr></table>
    </td></tr>` : ''}

    <!-- ode aan -->
    <tr><td class="pad" align="center" style="background:${KLEUR.wijn};padding:54px 50px;">
      <img src="${SITE}/mail/ode-o-creme.png" width="28" height="32" alt="" style="display:block;margin:0 auto 22px;border:0;">
      <h2 style="margin:0 0 14px;font-family:${SERIF};font-weight:400;font-size:34px;line-height:1.1;color:${KLEUR.creme};">Aan wie breng jij een <em>ode</em>?</h2>
      <p style="margin:0 0 26px;font-family:${SANS};font-weight:300;font-size:15px;line-height:1.7;color:${KLEUR.zandLicht};">Achter elk recept zit een verhaal. Van een mama, een opa, een buurvrouw. Deel het jouwe, dan komen we bij jou thuis en koken we het samen.</p>
      <a href="${odeAan}" style="display:inline-block;padding:15px 28px;border:1px solid ${KLEUR.creme};font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${KLEUR.creme};text-decoration:none;">Deel jouw verhaal</a>
    </td></tr>

    <!-- voet -->
    <tr><td class="pad" align="center" style="background:${KLEUR.wijnDiep};padding:44px 44px 40px;">
      <p style="margin:0 0 6px;font-family:${SERIF};font-size:26px;line-height:1.2;color:${KLEUR.creme};">Smaken die je <em>nooit</em> echt vergeet.</p>
      <p style="margin:0 0 28px;font-family:${SERIF};font-style:italic;font-size:19px;color:${KLEUR.zand};">Tot aan tafel.</p>
      <p style="margin:0;font-family:${SANS};font-weight:300;font-size:12px;line-height:1.7;color:${KLEUR.zand};">
        Je krijgt deze mail omdat je je inschreef voor Ode Zondag op odecuisine.be.<br>
        Antwoorden mag altijd, we lezen alles. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:${KLEUR.creme};">Uitschrijven</a> kan ook, met één klik.<br>
        ${esc(AFZENDER_ADRES)}
      </p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  return { onderwerp, html };
}

// ---------- Resend ----------
async function resend(pad, methode, body) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY ontbreekt.');
  const res = await fetch(`https://api.resend.com${pad}`, {
    method: methode,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${methode} ${pad} gaf ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

// ---------- start ----------
const args = process.argv.slice(2);
const arg = (naam) => { const i = args.indexOf(naam); return i >= 0 ? args[i + 1] : undefined; };
const recepten = leesRecepten();
const vandaag = vandaagBrussel();

let recept;
if (arg('--recept')) {
  recept = recepten.find((r) => r.slug === arg('--recept'));
  if (!recept) throw new Error(`Recept "${arg('--recept')}" niet gevonden.`);
} else if (args.includes('--verstuur')) {
  recept = recepten.find((r) => r.datumIso === vandaag);
  if (!recept) { console.log(`Geen recept met datum ${vandaag}. Deze zondag gaat er geen mail uit.`); process.exit(0); }
} else {
  recept = recepten.find((r) => r.datumIso >= vandaag) || recepten[recepten.length - 1];
}

const nummer = recepten.filter((r) => r.datumIso <= recept.datumIso).length;
const { onderwerp, html } = maakMail(recept, nummer);

if (args.includes('--test')) {
  const naar = arg('--test');
  if (!naar) throw new Error('Geef een adres mee: --test jij@mail.be');
  const testHtml = html.replace('{{{RESEND_UNSUBSCRIBE_URL}}}', `${SITE}/`);
  const r = await resend('/emails', 'POST', { from: AFZENDER, to: [naar], reply_to: ANTWOORD_NAAR, subject: `[test] ${onderwerp}`, html: testHtml });
  console.log(`Testmail verstuurd naar ${naar} (id ${r.id}).`);
} else if (args.includes('--verstuur')) {
  const segment = process.env.RESEND_SEGMENT_ID;
  if (!segment) throw new Error('RESEND_SEGMENT_ID ontbreekt.');
  const naam = `ode-zondag-${recept.datumIso}-${recept.slug}`;
  // Nooit twee keer dezelfde zondag versturen.
  const bestaand = await resend('/broadcasts', 'GET');
  if ((bestaand.data || []).some((b) => b.name === naam)) {
    console.log(`"${naam}" is al eerder aangemaakt. Niets opnieuw verstuurd.`);
    process.exit(0);
  }
  const b = await resend('/broadcasts', 'POST', { segment_id: segment, from: AFZENDER, reply_to: ANTWOORD_NAAR, subject: onderwerp, html, name: naam, send: true });
  console.log(`Ode Zondag N° ${nummer} (${recept.titel}) is verstuurd. Broadcast id ${b.id}.`);
} else {
  const uit = path.resolve('zondagsbrief-preview');
  fs.mkdirSync(uit, { recursive: true });
  const bestand = path.join(uit, `${recept.slug}.html`);
  fs.writeFileSync(bestand, html.replace('{{{RESEND_UNSUBSCRIBE_URL}}}', '#'));
  console.log(`Preview: ${bestand}\nOnderwerp: ${onderwerp}`);
}
