# Guía para agentes

Catálogo de perfumes de Diamantes Perfumería: sitio estático con Astro 6 + Tailwind v4 + TypeScript. Ver `README.md` para estructura y despliegue.

## Convenciones

- Idioma de la interfaz y de los textos: español. Código e identificadores: inglés/técnico.
- Datos de la tienda en `src/config/site.ts`; catálogo en `src/data/perfumes.json` (el `id` es el código del perfume).
- Estilos con clases de Tailwind y tokens de `src/styles/global.css` (`@theme`). Evita valores de color sueltos.
- La interactividad es JS vanilla en `src/scripts/`; la lógica pura vive en `src/lib/` y debe tener tests (Vitest).
- Nunca escribas secuencias `\uXXXX` en regex mediante herramientas que las decodifiquen; usa `\p{M}` u otra propiedad Unicode.
- Imágenes de perfumes: descárgalas a `src/assets/perfumes/<codigo>.<ext>` (no hotlinking) y anota la procedencia en `sources`. No inventes notas olfativas: si no hay dato fiable, deja el perfume sin completar y avisa. La intensidad no se escribe a mano: se deriva de `concentration` (`src/lib/intensity.ts`).

## Antes de dar algo por terminado

```sh
npm run format:check && npm run lint && npm run build   # build ejecuta tests + astro check
```

## Entorno

- Astro 6 porque Astro 7 exige Node ≥ 22.23.4. Si se actualiza Node, migrar con `npm i astro@^7`.
- Las dependencias `vite` (^7) se fijan en la raíz para que Tailwind y Astro compartan una sola copia.

## Documentación

- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Estilos y Tailwind](https://docs.astro.build/en/guides/styling/)
- [Imágenes](https://docs.astro.build/en/guides/images/)
