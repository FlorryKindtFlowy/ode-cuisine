import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Haalt de verwijzingen naar het framework uit de gebouwde bestanden (bronnen, klassen en attributen).
function neutraal() {
  const loop = (map, fn) => {
    for (const f of readdirSync(map)) {
      const p = join(map, f);
      if (statSync(p).isDirectory()) loop(p, fn);
      else if (/\.(html|css|js|xml)$/.test(f)) fn(p);
    }
  };
  return {
    name: 'neutraal',
    hooks: {
      'astro:build:done': ({ dir }) => {
        loop(fileURLToPath(dir), (p) => {
          const oud = readFileSync(p, 'utf8');
          const nieuw = oud.replace(/data-astro-cid-/g, 'data-o-').replace(/astro-island|astro-slot/g, 'o-eiland');
          if (nieuw !== oud) writeFileSync(p, nieuw);
        });
      },
    },
  };
}

export default defineConfig({
  site: 'https://www.odecuisine.be',
  build: { assets: 'static' },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/kerst/recept/') &&
        !page.includes('/kerst/keuken/') &&
        !page.includes('/aan-tafel') &&
        !page.includes('/bedankt') &&
        !page.includes('/het-schriftje'),
    }),
    neutraal(),
  ],
});
