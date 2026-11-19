import { describe, expect, it } from 'vitest';
import { BRAND_IDS, brands, resolveBrand, site, whatsappUrl, type SiteConfig } from './site';

const withContact = (contact: Partial<SiteConfig['contact']>): SiteConfig => ({
  ...site,
  contact: { ...site.contact, ...contact },
});

describe('site (configuración real)', () => {
  it('el WhatsApp son solo dígitos con indicativo de Colombia', () => {
    expect(site.contact.whatsapp).toMatch(/^57\d{10}$/);
  });
});

describe('brands', () => {
  it.each(BRAND_IDS)('%s tiene su id, nombre y colores', (id) => {
    expect(brands[id].id).toBe(id);
    expect(brands[id].name.length).toBeGreaterThan(0);
    expect(brands[id].themeColor).toMatch(/^#[0-9a-f]{6}$/);
    expect(brands[id].contact.whatsapp).toMatch(/^57\d{10}$/);
  });

  it('cada marca tiene su propio nombre y dirección', () => {
    expect(brands.diamantes.name).not.toBe(brands.badboy.name);
    expect(brands.diamantes.contact.address).not.toBe(brands.badboy.contact.address);
  });
});

describe('resolveBrand', () => {
  it('usa diamantes si no se define', () => {
    expect(resolveBrand(undefined)).toBe('diamantes');
    expect(resolveBrand('')).toBe('diamantes');
  });

  it('acepta una marca conocida', () => {
    expect(resolveBrand('badboy')).toBe('badboy');
  });

  it('falla con una marca desconocida', () => {
    expect(() => resolveBrand('otra')).toThrow(/BRAND/);
  });
});

describe('whatsappUrl', () => {
  it('construye el enlace wa.me con el mensaje codificado', () => {
    const url = whatsappUrl(withContact({ whatsapp: '573243903809' }));
    expect(url).toBe(`https://wa.me/573243903809?text=${encodeURIComponent(site.whatsappMessage)}`);
  });

  it('devuelve null si no hay número', () => {
    expect(whatsappUrl(withContact({ whatsapp: null }))).toBeNull();
  });
});
