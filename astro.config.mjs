import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.odecuisine.be',
  integrations: [sitemap({ filter: (page) => !page.includes('/kerst/recept/') && !page.includes('/kerst/keuken/') })],
});
