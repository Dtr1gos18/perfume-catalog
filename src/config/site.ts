/**
 * Datos de la tienda. Edita SOLO este archivo para actualizar la tarjeta "Visítanos".
 * Los campos en `null` no se muestran en producción (en desarrollo aparece un marcador).
 */
export interface SiteConfig {
  name: string;
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

export const site: SiteConfig = {
  name: 'Diamantes Perfumería',
  tagline: 'Catálogo',
  description:
    'Catálogo de fragancias de Diamantes Perfumería en Cúcuta: busca por código o nombre, filtra por género y conoce las notas de cada perfume.',
  locale: 'es_CO',
  contact: {
    address: 'Centro Comercial La Mercedes, entrada #4, Cúcuta',
    hours: [
      { days: 'Lunes a viernes', time: '7:30 a. m. – 6:00 p. m.' },
      { days: 'Sábados', time: '8:00 a. m. – 6:00 p. m.' },
      { days: 'Domingos y festivos', time: '8:00 a. m. – 1:00 p. m.' },
    ],
    whatsapp: '573243903809',
  },
  whatsappMessage: 'Hola, quisiera información sobre un perfume del catálogo.',
};

export function whatsappUrl(config: SiteConfig = site): string | null {
  const { whatsapp } = config.contact;
  if (!whatsapp) return null;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(config.whatsappMessage)}`;
}
