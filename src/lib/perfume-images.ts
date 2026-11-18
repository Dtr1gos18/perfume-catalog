import type { ImageMetadata } from 'astro';

/**
 * Fotos de perfumes por convención de nombre: `src/assets/perfumes/<codigo>.<ext>`.
 * Basta con soltar `104.jpg` en esa carpeta para que el perfume con código 104 la use.
 * (Un campo `image` explícito en perfumes.json tiene prioridad.)
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/perfumes/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

/** "../assets/perfumes/104.jpg" → "104" */
export function codeFromPath(path: string): string {
  const file = path.split('/').pop() ?? '';
  return file.replace(/\.[^.]+$/, '');
}

const byCode = new Map(
  Object.entries(modules).map(([path, mod]) => [codeFromPath(path), mod.default]),
);

export function findPerfumeImage(code: string): ImageMetadata | undefined {
  return byCode.get(code);
}
