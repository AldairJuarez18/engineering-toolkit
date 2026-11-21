import { describe, expect, it } from 'vitest';
import { solveResistors } from './resistors';

describe('solveResistors', () => {
  it('suma correctamente resistencias en serie (100 Ω + 220 Ω + 330 Ω = 650 Ω)', () => {
    const res = solveResistors('series', [100, 220, 330]);
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.equivalentResistance).toBeCloseTo(650, 6);
    }
  });

  it('calcula correctamente dos resistencias iguales en paralelo (1000 Ω || 1000 Ω = 500 Ω)', () => {
    const res = solveResistors('parallel', [1000, 1000]);
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.equivalentResistance).toBeCloseTo(500, 6);
    }
  });

  it('calcula correctamente resistencias distintas en paralelo (100 Ω || 400 Ω = 80 Ω)', () => {
    const res = solveResistors('parallel', [100, 400]);
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.equivalentResistance).toBeCloseTo(80, 6);
    }
  });

  it('devuelve error si alguna resistencia es menor o igual a cero', () => {
    const res = solveResistors('series', [100, 0]);
    expect(res.status).toBe('error');
  });
});