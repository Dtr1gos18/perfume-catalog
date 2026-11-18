import { describe, expect, it } from 'vitest';
import { formatCount, isGenderFilter, matchesFilters, normalize } from './filter';

const jazmin = { code: '105', name: 'Jazmín de Noche', gender: 'Mujer' };
const cedro = { code: '103', name: 'Cedro Azul', gender: 'Hombre' };

describe('normalize', () => {
  it('pasa a minúsculas y quita tildes', () => {
    expect(normalize('Ámbar Nocturno')).toBe('ambar nocturno');
    expect(normalize('Jazmín')).toBe('jazmin');
  });
});

describe('matchesFilters', () => {
  it('sin búsqueda y con "Todos" deja pasar todo', () => {
    expect(matchesFilters(jazmin, '', 'Todos')).toBe(true);
    expect(matchesFilters(jazmin, '   ', 'Todos')).toBe(true);
  });

  it('busca por nombre ignorando tildes y mayúsculas', () => {
    expect(matchesFilters(jazmin, 'JAZMIN', 'Todos')).toBe(true);
    expect(matchesFilters(jazmin, 'noche', 'Todos')).toBe(true);
    expect(matchesFilters(jazmin, 'cedro', 'Todos')).toBe(false);
  });

  it('busca por código (coincidencia parcial)', () => {
    expect(matchesFilters(jazmin, '105', 'Todos')).toBe(true);
    expect(matchesFilters(jazmin, '10', 'Todos')).toBe(true);
    expect(matchesFilters(jazmin, '999', 'Todos')).toBe(false);
  });

  it('recorta espacios alrededor de la búsqueda', () => {
    expect(matchesFilters(cedro, '  cedro  ', 'Todos')).toBe(true);
  });

  it('filtra por género', () => {
    expect(matchesFilters(jazmin, '', 'Mujer')).toBe(true);
    expect(matchesFilters(jazmin, '', 'Hombre')).toBe(false);
  });

  it('combina género y búsqueda', () => {
    expect(matchesFilters(cedro, 'cedro', 'Hombre')).toBe(true);
    expect(matchesFilters(cedro, 'cedro', 'Mujer')).toBe(false);
  });
});

describe('formatCount', () => {
  it('usa singular y plural', () => {
    expect(formatCount(0)).toBe('0 perfumes');
    expect(formatCount(1)).toBe('1 perfume');
    expect(formatCount(8)).toBe('8 perfumes');
  });
});

describe('isGenderFilter', () => {
  it('valida valores permitidos', () => {
    expect(isGenderFilter('Mujer')).toBe(true);
    expect(isGenderFilter('Todos')).toBe(true);
    expect(isGenderFilter('Otro')).toBe(false);
    expect(isGenderFilter(undefined)).toBe(false);
  });
});
