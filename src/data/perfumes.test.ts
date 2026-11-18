import { describe, expect, it } from 'vitest';
import perfumes from './perfumes.json';

/**
 * Astro solo emite un aviso ante ids repetidos y sobrescribe la entrada anterior
 * (un perfume desaparecería sin error). Este test hace que el build falle.
 */
describe('perfumes.json', () => {
  it('no tiene códigos repetidos', () => {
    const ids = perfumes.map((p) => p.id);
    const repeated = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(repeated, `Códigos repetidos: ${repeated.join(', ')}`).toEqual([]);
  });

  it('todos los códigos son texto no vacío y sin espacios', () => {
    for (const { id } of perfumes) {
      expect(id).toMatch(/^\S+$/);
    }
  });

  it('las descripciones no contienen notas internas de trabajo', () => {
    const internal = /confirmar|probablemente|pendiente|depende de la edici/i;
    const bad = perfumes.filter(
      (p) => 'description' in p && internal.test((p as { description: string }).description),
    );
    expect(
      bad.map((p) => p.id),
      'Descripciones con notas internas',
    ).toEqual([]);
  });
});
