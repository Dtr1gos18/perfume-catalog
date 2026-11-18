# Diamantes Perfumería — Catálogo

Landing page / catálogo de perfumes. Sitio estático hecho con **Astro 6**, **Tailwind CSS v4** y **TypeScript**. Se despliega gratis en Cloudflare Pages, Vercel o Netlify.

## Características

- Búsqueda por código o nombre (ignora mayúsculas y tildes) y filtro por género.
- Catálogo guiado por datos: un solo JSON validado con Zod (Content Collections).
- Frasco dibujado con CSS cuando un perfume aún no tiene foto.
- Tarjeta "Visítanos" con enlace a WhatsApp (`wa.me`).
- Fuentes autoalojadas, imágenes optimizadas (WebP), SEO básico (meta, Open Graph, sitemap, robots).
- Accesible: etiquetas, `aria-pressed`, foco visible, `aria-live` en el contador, "saltar al catálogo".

## Requisitos

Node.js **≥ 22.12** (ver `.nvmrc`).

```sh
npm install
npm run dev      # http://localhost:4321
```

## Scripts

| Comando           | Acción                                            |
| :---------------- | :------------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo                            |
| `npm run build`   | Tests + tipos (`astro check`) y compila a `dist/` |
| `npm run preview` | Sirve el build local                              |
| `npm run lint`    | ESLint                                            |
| `npm run format`  | Prettier (con orden de clases de Tailwind)        |
| `npm test`        | Pruebas unitarias (Vitest) de la lógica de filtro |

## Estructura

```text
src/
├── assets/            logo y (más adelante) fotos de perfumes
├── components/        Header, Catalog, ProductRow, VisitCard, …
├── config/site.ts     datos de la tienda (WhatsApp, dirección, horario…)
├── data/perfumes.json catálogo
├── lib/filter.ts      lógica pura de búsqueda/filtro (con tests)
├── scripts/           mejora progresiva (JS vanilla, sin framework)
├── styles/global.css  tokens de diseño (@theme) y fuentes
└── content.config.ts  esquema Zod del catálogo
```

## Cómo actualizar los datos

### Datos de la tienda

Edita `src/config/site.ts` (`contact.whatsapp`, `address`, `hours`).
El WhatsApp va solo con dígitos e indicativo de país, sin `+` (ej. `573001234567`). El horario es una lista de `{ days, time }`, una entrada por franja.
Mientras un campo sea `null` no se muestra en producción (en `npm run dev` aparece un marcador).

### Agregar un perfume

Añade un objeto a `src/data/perfumes.json`. El `id` es el **código** (texto único). Solo `id`, `name` y `gender` son obligatorios:

```json
{
  "id": "110",
  "name": "Nombre del perfume",
  "gender": "Mujer",
  "family": "Floral",
  "concentration": "EDP",
  "notes": { "top": "Pera", "heart": "Jazmín", "base": "Sándalo" },
  "image": "../assets/perfumes/110.jpg",
  "sources": ["https://ejemplo.com/ficha-del-perfume"]
}
```

- `gender`: `Unisex`, `Hombre` o `Mujer`.
- `concentration`: `EDC`, `EDT`, `EDP`, `Intense`, `Parfum` o `Elixir`.
- **Intensidad:** se deriva de la `concentration` (EDC 1 · EDT 2 · EDP 3 · Intense 4 · Parfum/Elixir 5; ver `src/lib/intensity.ts`). Es una aproximación editorial, no un dato oficial de las marcas. Para fijarla a mano usa `"intensity": 1–5` junto con `"intensityBasis"`:
  - `"resenas"`: calculada con votos de usuarios sobre duración y proyección (60 % duración + 40 % proyección; fórmula en `src/lib/intensity.ts`, con tests). La tarjeta muestra "según reseñas".
  - `"estimada"`: sin datos suficientes (se usa 3, el punto medio, o una estimación de una sola fuente). La tarjeta muestra "Estimada". Sustitúyela cuando conozcas la concentración (campo `concentration`) o tengas reseñas.
- `family`, `notes` y `intensity` se ocultan si no hay dato. Es preferible dejarlos vacíos que publicar algo dudoso.
- `description`: texto libre (viene del catálogo Word). Se muestra como "Características" **solo si el perfume no tiene `notes`**. No debe llevar notas internas como "confirmar versión" (un test lo comprueba).
- `sources`: URLs de donde salen los datos, para poder auditarlos.
- Un campo con formato inválido rompe el build con un mensaje claro, y un test (`npm test`) también lo hace si hay códigos repetidos.

### Fotos de los perfumes

Las fotos se asocian **solas por el nombre del archivo**: `src/assets/perfumes/<codigo>.jpg` (por ejemplo `104.jpg` o `001.jpg`; el código debe coincidir exactamente, con ceros). Sin foto se muestra un frasco de relleno según el género. No hace falta tocar el JSON.

Flujo recomendado con fotos propias del celular:

1. `npm run photos:status -- --csv` genera `fotos-pendientes.csv` (código, nombre, género) como lista de trabajo.
2. Fotografía cada frasco (fondo liso claro, buena luz, de frente) y nombra el archivo con su código en una carpeta temporal, por ejemplo `C:\fotos\104.jpg`.
3. `npm run photos:prepare -- C:\fotos` las normaliza a 800×800 sobre fondo blanco y las copia a `src/assets/perfumes/`. Avisa de nombres que no coinciden con ningún código y no pisa fotos existentes (usa `--force` para reemplazar).
4. `npm run photos:status` muestra el avance. `npm test` falla si una foto tiene un nombre que no corresponde a un perfume.

> Las fotos de marcas comerciales tienen derechos de imagen. Usa fotos propias o con permiso (por ejemplo, el material gráfico que da tu distribuidor). Las imágenes con licencia libre (Wikimedia Commons) casi no existen para estos productos: en una prueba con 9 perfumes conocidos solo apareció una.

## Despliegue gratuito

Es un sitio 100 % estático (`dist/`).

### Cloudflare Pages (recomendado)

1. Sube el repo a GitHub.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → conecta el repo.
3. Build command: `npm run build` · Output directory: `dist`.
4. Variables de entorno: `SITE_URL` = tu URL final (ej. `https://tu-dominio.com`) y `NODE_VERSION` = `22`.

### Vercel / Netlify

Importa el repo; ambos detectan Astro. Define `SITE_URL` en las variables de entorno.

### GitHub Pages

Funciona, pero requiere `base: '/nombre-del-repo'` en `astro.config.mjs` y ajustar `SITE_URL`.

## Pendiente / notas

- `SITE_URL` por defecto es un marcador (`diamantes-perfumeria.pages.dev`); define la real al desplegar (afecta canonical, sitemap y robots).
- El catálogo tiene los 194 perfumes reales (códigos de la tienda). El género inicial se infirió por rango de código (001–447 hombre, 501–926 mujer) y se corrigió a Unisex en 7 casos que las fuentes clasifican así.
- Datos olfativos: provienen de resúmenes de búsqueda y minoristas (Parfumo y Fragrantica bloquean la lectura automática), **no** de fichas oficiales. Hay notas en 116 de 194 perfumes, 22 más tienen solo una descripción de texto, familia en 122. Los 194 tienen intensidad: 139 derivada de la concentración, 5 según reseñas de usuarios y 50 estimadas (45 de ellas sin ningún dato, con el valor 3). `npm run data:status -- --csv` genera `datos-pendientes.csv` con lo que falta de cada perfume y una columna `concentracion` para rellenar. Revisa los de mayor rotación antes de publicar.
- Falta el código 505 en la lista original (salta de 504 a 506).
- Los nombres con "Nueva"/"Nuevo" se conservaron tal cual.
- Astro 7 exige Node ≥ 22.23.4. Al actualizar Node, ejecuta `npm i astro@^7` (corrige avisos de `npm audit`).
