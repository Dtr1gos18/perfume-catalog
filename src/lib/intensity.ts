export const CONCENTRATIONS = ['EDC', 'EDT', 'EDP', 'Intense', 'Parfum', 'Elixir'] as const;
export type Concentration = (typeof CONCENTRATIONS)[number];

/**
 * Intensidad (1–5) derivada de la concentración del producto.
 * Es una aproximación editorial, NO un dato oficial de las marcas:
 * a mayor concentración de aceites, mayor intensidad típica.
 */
const LEVEL_BY_CONCENTRATION: Record<Concentration, number> = {
  EDC: 1,
  EDT: 2,
  EDP: 3,
  Intense: 4,
  Parfum: 5,
  Elixir: 5,
};

export function intensityFromConcentration(concentration?: Concentration): number | undefined {
  return concentration ? LEVEL_BY_CONCENTRATION[concentration] : undefined;
}

/** Un valor explícito en el JSON tiene prioridad sobre el derivado. */
export function resolveIntensity(
  explicit?: number,
  concentration?: Concentration,
): number | undefined {
  return explicit ?? intensityFromConcentration(concentration);
}

/** De dónde sale una intensidad escrita explícitamente en el JSON. */
export const INTENSITY_BASES = ['resenas', 'estimada'] as const;
export type IntensityBasis = (typeof INTENSITY_BASES)[number];

/** Votos de usuarios sobre cuánto dura un perfume. */
export interface LongevityVotes {
  veryWeak: number;
  weak: number;
  moderate: number;
  long: number;
  eternal: number;
}

/** Votos de usuarios sobre cuánto se proyecta (estela). */
export interface ProjectionVotes {
  intimate: number;
  soft: number;
  moderate: number;
  strong: number;
  enormous: number;
}

/** Media ponderada de una escala 1–5 a partir de conteos; undefined si no hay votos. */
function meanScore(counts: number[]): number | undefined {
  const total = counts.reduce((sum, n) => sum + n, 0);
  if (total <= 0) return undefined;
  return counts.reduce((sum, n, i) => sum + n * (i + 1), 0) / total;
}

export function longevityScore(v?: LongevityVotes): number | undefined {
  return v && meanScore([v.veryWeak, v.weak, v.moderate, v.long, v.eternal]);
}

export function projectionScore(v?: ProjectionVotes): number | undefined {
  return v && meanScore([v.intimate, v.soft, v.moderate, v.strong, v.enormous]);
}

/**
 * Intensidad (1–5) a partir de puntuaciones de duración y proyección (cada una 1–5):
 * 60 % duración + 40 % proyección. Si solo hay una de las dos, se usa esa.
 */
export function intensityFromScores(longevity?: number, projection?: number): number | undefined {
  let blended: number;
  if (longevity !== undefined && projection !== undefined) {
    blended = 0.6 * longevity + 0.4 * projection;
  } else if (longevity !== undefined || projection !== undefined) {
    blended = (longevity ?? projection) as number;
  } else {
    return undefined;
  }
  return Math.min(5, Math.max(1, Math.round(blended)));
}

/** Intensidad a partir del desglose de votos de usuarios (duración y proyección). */
export function intensityFromVotes(
  longevity?: LongevityVotes,
  projection?: ProjectionVotes,
): number | undefined {
  return intensityFromScores(longevityScore(longevity), projectionScore(projection));
}
