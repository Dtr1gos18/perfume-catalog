// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL pública del sitio (canonical, sitemap, Open Graph).
// Defínela con la variable de entorno SITE_URL en tu hosting cuando tengas dominio.
// Marca activa (BRAND, ver src/config/site.ts) y su URL por defecto mientras no haya dominio.
/** @type {Record<string, string>} */
const defaultUrls = {
  diamantes: 'https://diamantes-perfumeria.pages.dev',
  badboy: 'https://badboy-perfumeria.pages.dev',
};
const site = process.env.SITE_URL ?? defaultUrls[process.env.BRAND ?? 'diamantes'];

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['peridermal-untested-jamal.ngrok-free.dev'],
    },
    preview: {
      allowedHosts: ['peridermal-untested-jamal.ngrok-free.dev'],
    },
  },
});
