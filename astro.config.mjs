// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL pública del sitio (canonical, sitemap, Open Graph).
// Defínela con la variable de entorno SITE_URL en tu hosting cuando tengas dominio.
const site = process.env.SITE_URL ?? 'https://diamantes-perfumeria.pages.dev';

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
