export const GENDER_FILTERS = ['Todos', 'Unisex', 'Hombre', 'Mujer'] as const;
export type GenderFilter = (typeof GENDER_FILTERS)[number];

export interface Searchable {
  code: string;
  name: string;
  gender: string;
}

/** Minúsculas y sin tildes, para que "jazmin" encuentre "Jazmín". */
export function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

/**
 * Un perfume coincide si pasa el filtro de género y la búsqueda
 * (por código o nombre, ignorando mayúsculas y tildes).
 */
export function matchesFilters(item: Searchable, query: string, gender: GenderFilter): boolean {
  if (gender !== 'Todos' && item.gender !== gender) return false;

  const needle = normalize(query.trim());
  if (!needle) return true;

  return normalize(item.code).includes(needle) || normalize(item.name).includes(needle);
}

export function formatCount(count: number): string {
  return count === 1 ? '1 perfume' : `${count} perfumes`;
}

export function isGenderFilter(value: unknown): value is GenderFilter {
  return (GENDER_FILTERS as readonly unknown[]).includes(value);
}
