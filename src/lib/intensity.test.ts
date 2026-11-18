import { describe, expect, it } from 'vitest';
import {
  CONCENTRATIONS,
  intensityFromConcentration,
  intensityFromScores,
  intensityFromVotes,
  resolveIntensity,
} from './intensity';

describe('intensityFromConcentration', () => {
  it('mapea cada concentración a un nivel entre 1 y 5', () => {
    for (const c of CONCENTRATIONS) {
      const level = intensityFromConcentration(c);
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(5);
    }
  });

  it('es monótona: más concentración, nunca menos intensidad', () => {
    const levels = CONCENTRATIONS.map((c) => intensityFromConcentration(c) as number);
    expect(levels).toEqual([...levels].sort((a, b) => a - b));
  });

  it('devuelve undefined si no hay concentración', () => {
    expect(intensityFromConcentration(undefined)).toBeUndefined();
  });
});

describe('intensityFromVotes', () => {
  // Votos reales de Fahrenheit (Dior) en Scento: duración 4.8 / proyección 4.7 según la página.
  const longevity = { veryWeak: 6, weak: 14, moderate: 70, long: 165, eternal: 85 };
  const projection = { intimate: 0, soft: 12, moderate: 70, strong: 150, enormous: 80 };

  it('mezcla duración y proyección en un valor de 1 a 5', () => {
    expect(intensityFromVotes(longevity, projection)).toBe(4);
  });

  it('un perfume que casi todos votan como débil da 1', () => {
    const weak = { veryWeak: 50, weak: 10, moderate: 0, long: 0, eternal: 0 };
    const intimate = { intimate: 40, soft: 10, moderate: 0, strong: 0, enormous: 0 };
    expect(intensityFromVotes(weak, intimate)).toBe(1);
  });

  it('un perfume que casi todos votan como eterno y enorme da 5', () => {
    const strong = { veryWeak: 0, weak: 0, moderate: 0, long: 5, eternal: 95 };
    const huge = { intimate: 0, soft: 0, moderate: 0, strong: 5, enormous: 95 };
    expect(intensityFromVotes(strong, huge)).toBe(5);
  });

  it('usa solo la duración si no hay votos de proyección', () => {
    expect(intensityFromVotes({ veryWeak: 0, weak: 0, moderate: 10, long: 0, eternal: 0 })).toBe(3);
  });

  it('devuelve undefined si no hay ningún voto', () => {
    expect(intensityFromVotes()).toBeUndefined();
    expect(
      intensityFromVotes({ veryWeak: 0, weak: 0, moderate: 0, long: 0, eternal: 0 }),
    ).toBeUndefined();
  });
});

describe('intensityFromScores', () => {
  it('pondera 60 % duración y 40 % proyección', () => {
    expect(intensityFromScores(5, 1)).toBe(3); // 0.6*5 + 0.4*1 = 3.4
    expect(intensityFromScores(1, 5)).toBe(3); // 0.6*1 + 0.4*5 = 2.6
    expect(intensityFromScores(4, 4)).toBe(4);
  });

  it('acota el resultado entre 1 y 5', () => {
    expect(intensityFromScores(0, 0)).toBe(1);
    expect(intensityFromScores(9, 9)).toBe(5);
  });

  it('usa la puntuación disponible si falta la otra', () => {
    expect(intensityFromScores(2, undefined)).toBe(2);
    expect(intensityFromScores(undefined, 4)).toBe(4);
    expect(intensityFromScores()).toBeUndefined();
  });
});

describe('resolveIntensity', () => {
  it('prioriza el valor explícito', () => {
    expect(resolveIntensity(2, 'Elixir')).toBe(2);
  });

  it('usa el derivado si no hay explícito', () => {
    expect(resolveIntensity(undefined, 'EDP')).toBe(3);
  });

  it('devuelve undefined sin datos', () => {
    expect(resolveIntensity()).toBeUndefined();
  });
});
