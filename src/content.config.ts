import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { CONCENTRATIONS, INTENSITY_BASES } from './lib/intensity';

/**
 * Catálogo de perfumes.
 * - `id` de cada entrada = código del perfume (string único, p. ej. "101").
 * - `image` es opcional: sin foto se dibuja un frasco de relleno (`bottle`).
 */
const perfumes = defineCollection({
  loader: file('src/data/perfumes.json'),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      gender: z.enum(['Unisex', 'Hombre', 'Mujer']),
      // Los datos olfativos son opcionales: se muestran solo cuando están verificados.
      family: z.string().min(1).optional(),
      notes: z
        .object({
          top: z.string().min(1).optional(),
          heart: z.string().min(1).optional(),
          base: z.string().min(1).optional(),
        })
        .optional(),
      /** Concentración del producto; de ella se deriva la intensidad (ver lib/intensity.ts). */
      concentration: z.enum(CONCENTRATIONS).optional(),
      /** Opcional: sobrescribe la intensidad derivada. */
      intensity: z.number().int().min(1).max(5).optional(),
      /** Cómo se obtuvo `intensity`: de reseñas de usuarios o como estimación sin datos. */
      intensityBasis: z.enum(INTENSITY_BASES).optional(),
      image: image().optional(),
      bottle: z
        .object({
          bg: z.string(),
          color: z.string(),
          width: z.number(),
          height: z.number(),
          radius: z.string(),
        })
        .optional(),
      /**
       * Texto libre del catálogo Word original. Se muestra solo cuando el perfume
       * no tiene `notes` por niveles (ver ProductRow.astro).
       */
      description: z.string().min(1).optional(),
      /** URLs de donde salen las notas / datos (trazabilidad). */
      sources: z.array(z.url()).optional(),
    }),
});

export const collections = { perfumes };
