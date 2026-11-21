import { describe, expect, it } from 'vitest';
import { solveOhmLaw } from './ohmLaw';

describe('solveOhmLaw', () => {
  it('calcula corriente y potencia dados voltaje y resistencia (12 V, 4 Ω)', () => {
    const res = solveOhmLaw({ voltage: 12, resistance: 4 });
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.current).toBeCloseTo(3, 6);
      expect(res.data.power).toBeCloseTo(36, 6);
    }
  });

  it('calcula resistencia y potencia dados voltaje y corriente (5 V, 0.02 A)', () => {
    const res = solveOhmLaw({ voltage: 5, current: 0.02 });
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.resistance).toBeCloseTo(250, 6);
      expect(res.data.power).toBeCloseTo(0.1, 6);
    }
  });

  it('calcula voltaje y corriente dados resistencia y potencia (100 Ω, 25 W)', () => {
    const res = solveOhmLaw({ resistance: 100, power: 25 });
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.voltage).toBeCloseTo(50, 6);
      expect(res.data.current).toBeCloseTo(0.5, 6);
    }
  });

  it('rechaza resistencias negativas o cero', () => {
    const res = solveOhmLaw({ voltage: 10, resistance: 0 });
    expect(res.status).toBe('error');
  });
});