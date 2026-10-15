// Maakt JPG versies van de receptfoto's voor de nieuwsbrief (Outlook toont geen webp).
// Maakt ook het Ode O logo als PNG in wijnrood en crème (mailprogramma's tonen geen SVG).
// Draait automatisch voor elke build (npm run build) en schrijft naar public/mail/fotos/.
import fs from 'node:fs';
import path from 'node:path';

let sharp;
try { sharp = (await import('sharp')).default; } catch { console.log('sharp niet gevonden, nieuwsbrieffoto\'s overgeslagen'); process.exit(0); }

const bron = path.resolve('public/fotos');
const doel = path.resolve('public/mail/fotos');
fs.mkdirSync(doel, { recursive: true });

// het O logo
const svg = fs.readFileSync(path.resolve('public/logo/ode-o.svg'), 'utf8').replace(/<metadata>[\s\S]*?<\/metadata>/, '');
for (const [kleur, naam] of [['#e8eef5', 'ode-o-creme.png'], ['#51121a', 'ode-o-wijn.png']]) {
  try {
    await sharp(Buffer.from(svg.replace(/currentColor/g, kleur))).resize({ height: 192 }).png().toFile(path.resolve('public/mail', naam));
  } catch (e) { console.log(`Logo overgeslagen: ${naam}`); }
}

const fotos = fs.readdirSync(bron).filter((f) => f.endsWith('.webp') && !f.endsWith('-klein.webp'));
for (const f of fotos) {
  const uit = path.join(doel, f.replace(/\.webp$/, '.jpg'));
  if (fs.existsSync(uit)) continue;
  try {
    await sharp(path.join(bron, f)).resize({ width: 1024, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(uit);
  } catch (e) { console.log(`Overgeslagen: ${f}`); }
}
console.log(`Nieuwsbrieffoto's klaar: ${fotos.length}`);
