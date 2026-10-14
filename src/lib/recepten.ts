import { getCollection } from 'astro:content';

// Recepten met een datum in de toekomst blijven verborgen tot hun zondag.
// Lokaal (npm run dev) of met PUBLIC_TOON_ALLES=true zie je ze allemaal, handig om na te kijken.
export async function zichtbareRecepten() {
  const toonAlles = import.meta.env.DEV || import.meta.env.PUBLIC_TOON_ALLES === 'true';
  const nu = new Date();
  const lijst = await getCollection('recepten', (r) => toonAlles || r.data.datum <= nu);
  return lijst.sort((a, b) => b.data.datum.valueOf() - a.data.datum.valueOf());
}
