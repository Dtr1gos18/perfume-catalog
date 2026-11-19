/**
 * Datos de las tiendas. Un mismo catálogo se publica para varias perfumerías: la marca activa
 * se elige al compilar con la variable de entorno `BRAND` (ver README). Edita aquí los datos de
 * contacto de cada una. Los campos en `null` no se muestran en producción (en desarrollo
 * aparece un marcador).
 */
export const BRAND_IDS = ['diamantes', 'badboy'] as const;
export type BrandId = (typeof BRAND_IDS)[number];

export interface SiteConfig {
  id: BrandId;
  name: string;
  /** Icono de la pestaña, en `public/`. */
  favicon: string;
  /** Color de la barra del navegador en móvil (el mismo `--color-accent` de la marca). */
  themeColor: string;
  tagline: string;
  description: string;
  locale: string;
  contact: {
    address: string | null;
    /** Una entrada por franja horaria; la franja (`time`) nunca se parte en dos líneas. */
    hours: { days: string; time: string }[] | null;
    /** Solo dígitos con indicativo de país, sin "+". Ej.: "573001234567". */
    whatsapp: string | null;
  };
  /** Mensaje inicial que se prellena al abrir WhatsApp. */
  whatsappMessage: string;
}

const shared = {
  tagline: 'Catálogo',
  locale: 'es_CO',
  hours: [
    { days: 'Lunes a viernes', time: '7:30 a. m. – 6:00 p. m.' },
    { days: 'Sábados', time: '8:00 a. m. – 6:00 p. m.' },
    { days: 'Domingos y festivos', time: '8:00 a. m. – 1:00 p. m.' },
  ],
  whatsapp: '573243903809',
  whatsappMessage: 'Hola, quisiera información sobre un perfume del catálogo.',
};

const describe = (name: string) =>
  `Catálogo de fragancias de ${name} en Cúcuta: busca por código o nombre, filtra por género y conoce las notas de cada perfume.`;

export const brands: Record<BrandId, SiteConfig> = {
  diamantes: {
    id: 'diamantes',
    name: 'Diamantes Perfumería',
    favicon: '/favicon.svg',
    themeColor: '#c2185b',
    tagline: shared.tagline,
    description: describe('Diamantes Perfumería'),
    locale: shared.locale,
    contact: {
      address: 'Centro Comercial La Mercedes, entrada #4, Cúcuta',
      hours: shared.hours,
      whatsapp: shared.whatsapp,
    },
    whatsappMessage: shared.whatsappMessage,
  },
  badboy: {
    id: 'badboy',
    name: 'Bad Boy Perfumería',
    favicon: '/favicon-badboy.svg',
    themeColor: '#d50000',
    tagline: shared.tagline,
    description: describe('Bad Boy Perfumería'),
    locale: shared.locale,
    contact: {
      address: 'Centro Comercial La Mercedes, entrada #3, Cúcuta',
      hours: shared.hours,
      whatsapp: shared.whatsapp,
    },
    whatsappMessage: shared.whatsappMessage,
  },
};

/** Marca por defecto cuando no se define `BRAND`. */
export function resolveBrand(value: string | undefined): BrandId {
  if (!value) return 'diamantes';
  if ((BRAND_IDS as readonly string[]).includes(value)) return value as BrandId;
  throw new Error(`BRAND="${value}" no es válida. Usa una de: ${BRAND_IDS.join(', ')}.`);
}

export const site: SiteConfig = brands[resolveBrand(process.env.BRAND)];

export function whatsappUrl(config: SiteConfig = site): string | null {
  const { whatsapp } = config.contact;
  if (!whatsapp) return null;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(config.whatsappMessage)}`;
}
