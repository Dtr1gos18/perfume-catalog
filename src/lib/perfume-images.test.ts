import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import perfumes from '../data/perfumes.json';
import { codeFromPath } from './perfume-images';

describe('codeFromPath', () => {
  it('extrae el código del nombre de archivo', () => {
    expect(codeFromPath('../assets/perfumes/104.jpg')).toBe('104');
    expect(codeFromPath('../assets/perfumes/001.webp')).toBe('001');
  });
});

/**
 * Una foto con nombre equivocado (p. ej. "1.jpg" en vez de "001.jpg") no daría error:
 * simplemente no se usaría. Este test lo detecta.
 */
describe('fotos en src/assets/perfumes', () => {
  const dir = path.resolve(__dirname, '../assets/perfumes');
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => !f.startsWith('.')) : [];
  const ids = new Set(perfumes.map((p) => p.id));

  it('cada archivo se llama como el código de un perfume existente', () => {
    const orphans = files.filter((f) => !ids.has(f.replace(/\.[^.]+$/, '')));
    expect(orphans, `Fotos sin perfume asociado: ${orphans.join(', ')}`).toEqual([]);
  });

  it('no hay dos fotos para el mismo código', () => {
    const codes = files.map((f) => f.replace(/\.[^.]+$/, ''));
    const repeated = codes.filter((c, i) => codes.indexOf(c) !== i);
    expect(repeated, `Códigos con más de una foto: ${repeated.join(', ')}`).toEqual([]);
  });
});
