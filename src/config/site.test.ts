import { describe, expect, it } from 'vitest';
import { site, whatsappUrl, type SiteConfig } from './site';

const withContact = (contact: Partial<SiteConfig['contact']>): SiteConfig => ({
  ...site,
  contact: { ...site.contact, ...contact },
});

describe('site (configuración real)', () => {
  it('el WhatsApp son solo dígitos con indicativo de Colombia', () => {
    expect(site.contact.whatsapp).toMatch(/^57\d{10}$/);
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
